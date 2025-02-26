import { defineStore } from 'pinia';
import { api } from "@hotwax/oms-api";
import { useAuthStore } from './auth';

export const useProductFeatureStore = defineStore('productFeature', {
  state: () => ({
    products: {} as Record<string, any[]>,
    isLoading: false
  }),
  getters: {
    getProducts: (state) => (productGroupId: string) => state.products[productGroupId] || [],
    getIsLoading: (state) => state.isLoading
  },
  actions: {
    async fetchProductsByGroupId(productGroupId: string) {
      if (this.products[productGroupId]) {
        console.log('Returning cached products for productGroupId:', productGroupId);
        return this.products[productGroupId];
      }

      this.isLoading = true;
      console.log('Fetching products with productGroupId:', productGroupId);
      try {
        const authStore = useAuthStore();
        const baseUrl = authStore.getBaseUrl;
        const response = await api({
          url: `${baseUrl}searchProducts`,
          method: "post",
          data: {
            "filters": [
              `groupId: ${productGroupId} OR productId: ${productGroupId}`
            ],
            "viewSize": 250
          },
          cache: true
        });

        console.log('API response:', response);

        if (response?.data?.response?.docs && response.data.response.docs.length > 0) {
          this.products[productGroupId] = response.data.response.docs;
          console.log('Fetched products:', this.products[productGroupId]);
          return this.products[productGroupId];
        } else {
          console.warn('No products found or error in response');
          return [];
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});