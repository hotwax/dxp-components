import { defineStore } from 'pinia';
import { api } from "@hotwax/oms-api";
import { useAuthStore } from './auth';

export const useProductFeatureStore = defineStore('productFeature', {
  state: () => ({
    products: {} as Record<string, any[]>,
    isLoading: false
  }),
  getters: {
    getProductsByGroupId: (state) => (productGroupId: string) => state.products[productGroupId] || [],
    isLoading: (state) => state.isLoading
  },
  actions: {
    async fetchProductsByGroupId(productGroupId: string) {
      if (this.products[productGroupId]) {
        return this.products[productGroupId];
      }

      this.isLoading = true;
      try {
        const authStore = useAuthStore();
        const baseUrl = authStore.getBaseUrl;
        const response = await api({
          url: `${baseUrl}/searchProducts`,
          method: "post",
          data: {
            "filters": [
              `groupId: ${productGroupId} OR productId: ${productGroupId}`
            ],
            "viewSize": 250
          },
          cache: true
        });

        if (response?.data?.response?.docs && response.data.response.docs.length > 0) {
          this.products[productGroupId] = response.data.response.docs;
          return this.products[productGroupId];
        } else {
          return [];
        }
      } catch (error) {
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});