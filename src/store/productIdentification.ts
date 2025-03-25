import { productIdentificationContext } from "../index";
import { defineStore } from "pinia";

export const useProductIdentificationStore = defineStore('productIdentification', {
  state: () => {
    return {
      productIdentificationPref: {
        primaryId: '',
        secondaryId: ''
      },
      productIdentificationOptions: [],
      goodIdentificationOptions: []
    }
  },
  getters: {
    getProductIdentificationPref: (state) => state.productIdentificationPref,
    getProductIdentificationOptions: (state) => state.productIdentificationOptions,
    getGoodIdentificationOptions: (state) => state.goodIdentificationOptions
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
    },
    async prepareProductIdentifierOptions() {
      //static identifications 
      const productIdentificationOptions = ["productId", "groupId", "groupName", "internalName", "parentProductName", "primaryProductCategoryName", "title"];
      
      //good identification types
      const fetchedGoodIdentificationTypes = await productIdentificationContext.fetchGoodIdentificationTypes("HC_GOOD_ID_TYPE");
      const fetchedGoodIdentificationOptions = fetchedGoodIdentificationTypes?.map((fetchedGoodIdentificationType: any) => fetchedGoodIdentificationType.goodIdentificationTypeId) || [];
  
      // Merge the arrays and remove duplicates
      this.productIdentificationOptions = Array.from(new Set([...productIdentificationOptions, ...fetchedGoodIdentificationOptions])).sort();
      this.goodIdentificationOptions = fetchedGoodIdentificationOptions
    }
  }
})
