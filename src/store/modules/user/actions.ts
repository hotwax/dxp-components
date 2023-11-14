import { UserService } from '@/services/UserService'
import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import store from '@/store';
import UserState from './UserState'
import * as types from './mutation-types'
import { showToast } from '@/utils'
import { Settings } from 'luxon'
import { hasError, logout, updateInstanceUrl, updateToken, resetConfig, getUserFacilities } from '@/adapter'
import logger from '@/logger'
import { getServerPermissionsFromRules, prepareAppPermissions, resetPermissions, setPermissions } from '@/authorization'
import { translate, useAuthStore, useUserStore } from '@hotwax/dxp-components'
import emitter from '@/event-bus'

const actions: ActionTree<UserState, RootState> = {

  /**
 * Login user and return token
 */
  async login ({ commit, dispatch }, payload) {
    try {
      const {token, oms} = payload;
      dispatch("setUserInstanceUrl", oms);

      // Getting the permissions list from server
      const permissionId = process.env.VUE_APP_PERMISSION_ID;
      // Prepare permissions list
      const serverPermissionsFromRules = getServerPermissionsFromRules();
      if (permissionId) serverPermissionsFromRules.push(permissionId);

      const serverPermissions = await UserService.getUserPermissions({
        permissionIds: serverPermissionsFromRules
      }, token);
      const appPermissions = prepareAppPermissions(serverPermissions);

      // Checking if the user has permission to access the app
      // If there is no configuration, the permission check is not enabled
      if (permissionId) {
        // As the token is not yet set in the state passing token headers explicitly
        // TODO Abstract this out, how token is handled should be part of the method not the callee
        const hasPermission = appPermissions.some((appPermissionId: any) => appPermissionId === permissionId );
        // If there are any errors or permission check fails do not allow user to login
        if (hasPermission) {
          const permissionError = 'You do not have permission to access the app.';
          showToast(translate(permissionError));
          logger.error("error", permissionError);
          return Promise.reject(new Error(permissionError));
        }
      }

      const userProfile = await UserService.getUserProfile(token);
      
      //fetching user facilities
      const baseURL = store.getters['user/getBaseUrl'];
      const facilities = await getUserFacilities(token, baseURL, userProfile?.partyId, "");


      if (!facilities.length) throw 'Unable to login. User is not assocaited with any facility'

      userProfile.facilities = facilities;
      // Getting unique facilities
      userProfile.facilities.reduce((uniqueFacilities: any, facility: any, index: number) => {
        if (uniqueFacilities.includes(facility.facilityId)) userProfile.facilities.splice(index, 1);
        else uniqueFacilities.push(facility.facilityId);
        return uniqueFacilities
      }, []);

      // TODO Use a separate API for getting facilities, this should handle user like admin accessing the app
      const currentFacility = userProfile.facilities[0];
      userProfile.stores = await UserService.getEComStores(token, currentFacility.facilityId);

      // In Job Manager application, we have jobs which may not be associated with any product store
      userProfile.stores.push({
        productStoreId: "",
        storeName: "None"
      })
      let preferredStore = userProfile.stores[0]

      const preferredStoreId =  await UserService.getPreferredStore(token);
      if (preferredStoreId) {
        const store = userProfile.stores.find((store: any) => store.productStoreId === preferredStoreId);
        store && (preferredStore = store)
      }

      /*  ---- Guard clauses ends here --- */

      setPermissions(appPermissions);
      if (userProfile.userTimeZone) {
        Settings.defaultZone = userProfile.userTimeZone;
      }

      // TODO user single mutation
      commit(types.USER_CURRENT_ECOM_STORE_UPDATED, preferredStore);
      commit(types.USER_CURRENT_FACILITY_UPDATED, currentFacility);
      commit(types.USER_INFO_UPDATED, userProfile);
      commit(types.USER_PERMISSIONS_UPDATED, appPermissions);
      commit(types.USER_TOKEN_CHANGED, { newToken: token })
      updateToken(token)
    } catch (err: any) {
      // If any of the API call in try block has status code other than 2xx it will be handled in common catch block.
      // TODO Check if handling of specific status codes is required.
      showToast(translate('Something went wrong while login. Please contact administrator.'));
      logger.error("error: ", err.toString());
      return Promise.reject(new Error(err))
    }
  },

  /**
   * Logout user
   */
  async logout ({ commit }, payload) {
    // store the url on which we need to redirect the user after logout api completes in case of SSO enabled
    let redirectionUrl = ''

    emitter.emit('presentLoader', { message: 'Logging out', backdropDismiss: false })

    // Calling the logout api to flag the user as logged out, only when user is authorised
    // if the user is already unauthorised then not calling the logout api as it returns 401 again that results in a loop, thus there is no need to call logout api if the user is unauthorised
    if(!payload?.isUserUnauthorised) {
      let resp;

      // wrapping the parsing logic in try catch as in some case the logout api makes redirection, and then we are unable to parse the resp and thus the logout process halts
      try {
        resp = await logout();

        // Added logic to remove the `//` from the resp as in case of get request we are having the extra characters and in case of post we are having 403
        resp = JSON.parse(resp.startsWith('//') ? resp.replace('//', '') : resp)
      } catch(err) {
        logger.error('Error parsing data', err)
      }

      if(resp?.logoutAuthType == 'SAML2SSO') {
        redirectionUrl = resp.logoutUrl
      }
    }

    const authStore = useAuthStore()
    const userStore = useUserStore()
    // TODO add any other tasks if need
    commit(types.USER_END_SESSION)
    resetConfig();
    resetPermissions();

    // reset plugin state on logout
    authStore.$reset()
    userStore.$reset()

    // If we get any url in logout api resp then we will redirect the user to the url
    if(redirectionUrl) {
      window.location.href = redirectionUrl
    }

    emitter.emit('dismissLoader')
    return redirectionUrl;
  },

  /**
   * update current facility information
   */
  async setFacility ({ commit, state }, payload) {
    const userProfile = JSON.parse(JSON.stringify(state.current as any));
    userProfile.stores = await UserService.getEComStores(undefined, payload.facility.facilityId);

    let preferredStore = userProfile.stores[0];
    const preferredStoreId =  await UserService.getPreferredStore(undefined);

    if (preferredStoreId) {
      const store = userProfile.stores.find((store: any) => store.productStoreId === preferredStoreId);
      store && (preferredStore = store)
    }
    commit(types.USER_INFO_UPDATED, userProfile);
    commit(types.USER_CURRENT_FACILITY_UPDATED, payload.facility);
    commit(types.USER_CURRENT_ECOM_STORE_UPDATED, preferredStore);
  },
  
  /**
   * Update user timeZone
   */
  async setUserTimeZone({ state, commit }, payload) {
    const current: any = state.current;
    if(current.userTimeZone !== payload.tzId) {
      try {
        const resp = await UserService.setUserTimeZone(payload)
        if (resp.status === 200 && !hasError(resp)) {
          const current: any = state.current;
          current.userTimeZone = payload.tzId;
          commit(types.USER_INFO_UPDATED, current);
          Settings.defaultZone = current.userTimeZone;
          showToast(translate("Time zone updated successfully"));
        }
      } catch(err) {
        logger.error('Failed to update timeZone')
      }
    }
  },

  // Set User Instance Url
  setUserInstanceUrl ({ commit }, payload){
    commit(types.USER_INSTANCE_URL_UPDATED, payload)
    updateInstanceUrl(payload)
  },

  /**
   *  update current eComStore information
  */
  async setEComStore({ commit }, payload) {
    commit(types.USER_CURRENT_ECOM_STORE_UPDATED, payload.eComStore);
    await UserService.setUserPreference({
      'userPrefTypeId': 'SELECTED_BRAND',
      'userPrefValue': payload.eComStore.productStoreId
    });
  },

  setUserPreference({ commit }, payload){
    commit(types.USER_PREFERENCE_UPDATED, payload)
  },

  updatePwaState({commit}, payload) {
    commit(types.USER_PWA_STATE_UPDATED, payload);
  }
}

export default actions;