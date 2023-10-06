import { defineStore } from "pinia";
import { i18n, useAuthStore } from "../../src";
import { api, client, hasError } from '@hotwax/oms-api'

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      current: {} as any,
      currentEComStore: {} as any,
      locale: 'en',
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" }
    }
  },
  getters: {
    getCurrentEComStore: (state) => state.currentEComStore,
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions,
    getUserProfile: (state) => state.current
  },
  actions: {
    async getEComStores(facilityId: string) {
      const authStore = useAuthStore();

      // If the facilityId is undefined, it may be case of user not associated with any facility
      if (!facilityId) {
        this.current.stores = [];
      }

      try {
        const params = {
          "inputFields": {
            "storeName_op": "not-empty",
            "facilityId": facilityId
          },
          "fieldList": ["productStoreId", "storeName"],
          "entityName": "ProductStoreFacilityDetail",
          "distinct": "Y",
          "noConditionFind": "Y",
          "filterByDate": 'Y',
        }
        const resp = await client({
          url: "performFind",
          method: "get",
          baseURL: authStore.getBaseUrl,
          params,
          headers: {
            Authorization: 'Bearer ' + authStore.getToken.value,
            'Content-Type': 'application/json'
          }
        });
        if (hasError(resp) || resp.data.docs.length === 0) {
          return Promise.reject(resp.data)
        }
        this.current.stores = resp.data.docs;
      } catch (error: any) {
        return Promise.reject(error)
      }
    },
    async getPreferredStore() {
      const authStore = useAuthStore();
      let preferredStore = {} as any;

      // Handling case if stores are not present, it may be case of user not associated with any facility
      if (this.current.stores.length) {
        preferredStore = this.current.stores[0];
        let preferredStoreId = '';

        try {
          const resp = await client({
            url: "service/getUserPreference",
            method: "post",
            data: {
              'userPrefTypeId': 'SELECTED_BRAND'
            },
            baseURL: authStore.getBaseUrl,
            headers: {
              Authorization: 'Bearer ' + authStore.getToken.value,
              'Content-Type': 'application/json'
            }
          });
          if (hasError(resp)) {
            return Promise.reject(resp.data);
          }
          preferredStoreId = resp.data.userPrefValue;
        } catch (error: any) {
          return Promise.reject(error)
        }

        if (preferredStoreId) {
          const store = this.current.stores.find((store: any) => store.productStoreId === preferredStoreId);
          store && (preferredStore = store)
        }
      }

      this.currentEComStore = preferredStore;
    },
    async setEComStore(payload: any) {
      await api({
        url: "service/setUserPreference",
        method: "post",
        data: {
          'userPrefTypeId': 'SELECTED_BRAND',
          'userPrefValue': payload.eComStore.productStoreId
        }
      });
      this.currentEComStore = payload.eComStore;
    },
    setLocale(payload: string) {
      // update locale in state and globally
      i18n.global.locale.value = payload
      this.locale = payload
    }
  },
  persist: true
})
