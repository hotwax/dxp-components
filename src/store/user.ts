import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      current: {},
      instanceUrl: '',
      currentEComStore: {
        productStoreId: "",
        storeName: "None"
      },
      shopifyConfigs: [],
      currentShopifyConfig: {},
    }
  },
  getters: {
    getInstanceUrl: (state) => state.instanceUrl,
    getUserProfile: (state) => state.current,
    getCurrentEComStore: (state) => state.currentEComStore,
    getShopifyConfigs: (state) => state.shopifyConfigs,
    getCurrentShopifyConfig: (state) => state.currentShopifyConfig
  },
  persist: true
})
