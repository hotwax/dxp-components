import { getProductIdentificationPref, setProductIdentificationPref } from "@hotwax/oms-api";
import { defineStore } from "pinia";

export const useProductIdentificationStore = defineStore('productIdentification', {
  state: () => {
    return {
      productIdentificationPref: {
        primaryId: 'productId',
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

      try {
        await setProductIdentificationPref(id, value, eComStoreId, productIdentificationPref)

        const pref = productIdentificationPref as any
        pref[id] = value
        this.productIdentificationPref = pref
      } catch(err) {
        console.log('error', err)
      }
    },
    async getIdentificaionPref(eComStoreId: string) {
      this.productIdentificationPref = await getProductIdentificationPref(eComStoreId)
    }
  }
})
