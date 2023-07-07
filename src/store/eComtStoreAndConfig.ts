import { defineStore } from "pinia";

export const useEComStoreAndConfigStore = defineStore('eComStoreAndConfig', {
  // TODO persist state in local storage
  state: () => {
    return {
      eComStores: [],
      shopifyConfigs: [],
      currentEComStore: {} as any,
      currentShopifyConfig: {} as any
    }
  },
  getters: {
    getEComStores: (state) => state.eComStores,
    getShopifyConfigs: (state) => state.shopifyConfigs,
    getCurrentEComStore: (state) => state.currentEComStore,
    getCurrentShopifyConfig: (state) => state.currentShopifyConfig,
  },
  actions: {
    async setEComStores(eComStores: any) {
      this.eComStores = eComStores
    },
    async setShopifyConfigs(shopifyConfigs: any) {
      this.shopifyConfigs = shopifyConfigs
    },
    async setCurrentEComStore(payload: any) {
      this.currentEComStore = payload.productStore
      if (!this.currentEComStore) {
        this.currentEComStore = this.eComStores.find((store: any) => store.productStoreId === payload.productStoreId)
      }
      this.currentEComStore = this.currentEComStore || {}
    },
    async setCurrentShopifyConfig(payload: any) {
      this.currentShopifyConfig = payload.shopifyConfig
      if (!this.currentShopifyConfig && payload.shopifyConfigId != this.currentShopifyConfig?.shopifyConfigId) {
        this.currentShopifyConfig = this.shopifyConfigs.find((config: any) => config.shopifyConfigId === payload.shopifyConfigId)
      }
      this.currentShopifyConfig = this.currentShopifyConfig || {}
    }
  }
})
