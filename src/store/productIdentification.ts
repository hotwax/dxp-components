import { productIdentificationContext } from "../index";
import { defineStore } from "pinia";

export const useProductIdentificationStore = defineStore('productIdentification', {
  state: () => {
    return {
      productIdentificationPref: {
        primaryId: '',
        secondaryId: ''
      },
      productIdentificationOptions: ["productId", "groupId", "groupName", "internalName", "parentProductName", "primaryProductCategoryName", "productId", "sku", "title", "SHOPIFY_PROD_SKU"]
    }
  },
  getters: {
    getProductIdentificationPref: (state) => state.productIdentificationPref,
    getProductIdentificationOptions: (state) => state.productIdentificationOptions
  },
  actions: {
    async setProductIdentificationPref(id: string, value: string, eComStoreId: string) {
      const productIdentificationPref = JSON.parse(JSON.stringify(this.getProductIdentificationPref))

      // When eComStoreId is not available then make the values change to what selected previously
      if(!eComStoreId) {
        this.productIdentificationPref = productIdentificationPref
        return;
      }

      productIdentificationPref[id] = value

      try {
        this.productIdentificationPref = await productIdentificationContext.setProductIdentificationPref(eComStoreId, productIdentificationPref)
      } catch(err) {
        // TODO: display a toast message in failed scenario
        console.error('error', err)
      }
    },
    async getIdentificationPref(eComStoreId: string) {
      // when selecting none as ecom store, not fetching the pref as it returns all the entries with the pref id
      if(!eComStoreId) {
        return this.productIdentificationPref = {
          primaryId: 'productId',
          secondaryId: ''
        };
      }

      this.productIdentificationPref = await productIdentificationContext.getProductIdentificationPref(eComStoreId)
    }
  }
})
