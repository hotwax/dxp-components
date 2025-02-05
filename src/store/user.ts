import { defineStore } from "pinia";
import { i18n, translate, userContext, useAuthStore } from "../../src";
import { DateTime } from "luxon";
import { showToast } from "src/utils";
import { facilityContext } from "../index";
import { productStoreContext } from "../index";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      eComStores: [],
      currentEComStore: {} as any,
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en-US": "English" },
      locale: 'en-US',
      currentTimeZoneId: '',
      timeZones: [],
      facilities: [],
      currentFacility: {} as any
    }
  },
  getters: {
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions,
    getTimeZones: (state) => state.timeZones,
    getCurrentTimeZone: (state) => state.currentTimeZoneId,
    getFacilites: (state) => state.facilities,
    getCurrentFacility: (state) => state.currentFacility,
    getProductStores: (state) => state.eComStores,
    getCurrentEComStore: (state) => state.currentEComStore,
  },
  actions: {
    async setLocale(locale: string) {
      let newLocale, matchingLocale
      newLocale = this.locale
      // handling if locale is not coming from userProfile
      try {
        if (locale) {
          matchingLocale = Object.keys(this.localeOptions).find((option: string) => option === locale)
          // If exact locale is not found, try to match the first two characters i.e primary code
          matchingLocale = matchingLocale || Object.keys(this.localeOptions).find((option: string) => option.slice(0, 2) === locale.slice(0, 2))
          newLocale = matchingLocale || this.locale
          // update locale in state and globally
          if(userContext.setUserLocale) await userContext.setUserLocale({ newLocale })
        }
      } catch (error) {
        console.error(error)
      } finally {
        i18n.global.locale.value = newLocale
        this.locale = newLocale
      }
    },
    async setUserTimeZone(tzId: string) {
      // Do not make any api call if the user clicks the same timeZone again that is already selected
      if(this.currentTimeZoneId === tzId) {
        return;
      }

      try {
        await userContext.setUserTimeZone({ tzId })
        this.currentTimeZoneId = tzId

        showToast(translate("Time zone updated successfully"));
        return Promise.resolve(tzId)
      } catch(err) {
        console.error('Error', err)
        return Promise.reject('')
      }
    },
    async getAvailableTimeZones() {
      // Do not fetch timeZones information, if already available
      if(this.timeZones.length) {
        return;
      }

      try {
        const resp = await userContext.getAvailableTimeZones()
        this.timeZones = resp.filter((timeZone: any) => DateTime.local().setZone(timeZone.id).isValid);
      } catch(err) {
        console.error('Error', err)
      }
    },
    updateTimeZone(tzId: string) {
      this.currentTimeZoneId = tzId
    },
    // Facility api calls - retrieve user facilities & get/set preferred facility
    async getUserFacilities(partyId: any, facilityGroupId: any, isAdminUser: boolean) {
      const authStore = useAuthStore();

      try {
        const response = await facilityContext.getUserFacilities(authStore.getToken.value, authStore.getBaseUrl, partyId, facilityGroupId, isAdminUser);
        this.facilities = response;
      } catch (error) {
        console.error(error);
      }
      return this.facilities
    },
    async getFacilityPreference(userPrefTypeId: any) {
      const authStore = useAuthStore();

      if (!this.facilities.length) {
        return;
      }
      let preferredFacility = this.facilities[0];
   
      try {
        let preferredFacilityId = await facilityContext.getUserPreference(authStore.getToken.value, authStore.getBaseUrl, userPrefTypeId);
        if(preferredFacilityId) {
          const facility = this.facilities.find((facility: any) => facility.facilityId === preferredFacilityId);
          facility && (preferredFacility = facility)
        }
      } catch (error) {
        console.error(error);
      }
      this.currentFacility = preferredFacility;
    },
    async setFacilityPreference(payload: any) {

      try {
        await facilityContext.setUserPreference({
          userPrefTypeId: 'SELECTED_FACILITY',
          userPrefValue: payload.facilityId
        }) 
      } catch (error) {
        console.error('error', error)
      }
      this.currentFacility = payload;
    },
    // ECom store api calls - fetch stores by facility & get/set user store preferences
    async getEComStoresByFacility(facilityId?: any) {
      const authStore = useAuthStore();
    
      try {
        const response = await productStoreContext.getEComStoresByFacility(authStore.getToken.value, authStore.getBaseUrl, 100, facilityId);
        this.eComStores = response;
      } catch (error) {
        console.error(error);
      }
      return this.eComStores
    },
    async getEComStores() {
      const authStore = useAuthStore();
    
      try {
        const response = await productStoreContext.getEComStores(authStore.getToken.value, authStore.getBaseUrl, 100);
        this.eComStores = response;
      } catch (error) {
        console.error(error);
      }
      return this.eComStores
    },
    async getEComStorePreference(userPrefTypeId: any) {
      const authStore = useAuthStore();

      if(!this.eComStores.length) {
        return;
      }
      let preferredStore = this.eComStores[0];
      try {
        let preferredStoreId = await productStoreContext.getUserPreference(authStore.getToken.value, authStore.getBaseUrl, userPrefTypeId);

        if(preferredStoreId) {
          const store = this.eComStores.find((store: any) => store.productStoreId === preferredStoreId);
          store && (preferredStore = store)
        }
      } catch (error) {
        console.error(error);
      }
      this.currentEComStore = preferredStore;
    },
    async setEComStorePreference(payload: any) {

      try {
        await productStoreContext.setUserPreference({
          userPrefTypeId: 'SELECTED_BRAND',
          userPrefValue: payload.productStoreId
        }) 
      } catch (error) {
        console.error('error', error)
      }
      this.currentEComStore = payload;
    }
  },
  persist: true
})
