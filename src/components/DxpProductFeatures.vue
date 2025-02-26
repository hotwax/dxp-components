<template>
  <div>
    <h1>hi from DxpProductFeatures</h1>
    <ion-spinner v-if="isLoading" name="crescent"/>
    <div v-else>
      <ion-list v-for="(featureOptions, featureType) in productFeatures" :key="featureType">
        <ion-list-header>{{ featureType }}</ion-list-header>
        <ion-item lines="none">
          <ion-row>
            <ion-chip
              v-for="option in featureOptions"
              :key="option"
              :outline="selectedFeatures[featureType] !== option"
              @click="handleFeatureSelection(option, featureType)"
            >
              <ion-label class="ion-text-wrap">{{ option }}</ion-label>
            </ion-chip>
          </ion-row>
        </ion-item>
      </ion-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonList,
  IonListHeader,
  IonItem,
  IonRow,
  IonChip,
  IonLabel,
  IonSpinner
} from '@ionic/vue';
import {sortSizes} from '../utils/apparel-sorter';
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import {api} from "@hotwax/oms-api" 

let props = defineProps(['productGroupId']);
const emit = defineEmits(['selected_variant']);

let products = [] as any[];
let productGroupId = props.productGroupId;
let isLoading = false;
let productFeatures = {} as Record<string, string[]>;
let selectedFeatures = {} as Record<string, string>;
let selectedProductId = '';


onMounted(()=>{
  fetchProductsByGroupId();
})

    async function fetchProductsByGroupId() {
      isLoading = true;
      console.log('Fetching products with productGroupId:', productGroupId);
      try {
        const response = await api({
          url: "https://dev-oms.hotwax.io/api/searchProducts",
          method: "post",
          data: JSON.stringify(    
            {
            "filters": [
              `groupId: ${productGroupId} OR productId: ${productGroupId}`
            ],
            "viewSize": 50
          }),
          cache: true
        });

        if (response?.data?.response?.docs && response.data.response.docs.length > 0) {
          products = response.data.response.docs;
          extractProductFeatures();
          console.log('Fetched products:', products);
        } else {
          // console.warn('No products found or error in response');
        }
      } catch (error) {
        // console.error('Error fetching products:', error);
      } finally {
        isLoading = false;
      }
    }


//on mounted block

function extractProductFeatures() {
      const features: Record<string, string[]> = {};
      const mainProduct = products.find(product => product.productId === productGroupId);

      if (mainProduct && mainProduct.productFeatures) {
        mainProduct.productFeatures.forEach((feature: string) => {
          const [type, value] = feature.split('/');
          if (!features[type]) {
            features[type] = [];
          }
          if (!features[type].includes(value)) {
            features[type].push(value);
          }
        });
      }

      // Sort feature types with a custom order
      const featureOrder = ['COLOR', 'SIZE'];
      const sortedFeatureTypes = Object.keys(features)
        .sort((a, b) => {
          const aIndex = featureOrder.indexOf(a.toUpperCase());
          const bIndex = featureOrder.indexOf(b.toUpperCase());
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          
          return a.localeCompare(b);
        });

      // Create a new sorted features object
      const sortedFeatures: Record<string, string[]> = {};
      sortedFeatureTypes.forEach(featureType => {
        sortedFeatures[featureType] = featureType.toUpperCase() === 'SIZE' 
          ? sortSizes(features[featureType]) 
          : features[featureType].sort();
      });

      productFeatures = sortedFeatures;

      // Set initial selection to first option of each feature
      Object.keys(sortedFeatures).forEach(featureType => {
        selectedFeatures[featureType] = sortedFeatures[featureType][0];
      });

      // Set initial selected product ID
      const selectedVariant = findMatchingVariant();
      if (selectedVariant) {
        selectedProductId = selectedVariant.productId;
      }
    }
function handleFeatureSelection(option: string, featureType: string) {
      selectedFeatures[featureType] = option;
      const selectedVariant = findMatchingVariant();
      if (selectedVariant) {
        selectedProductId = selectedVariant.productId;
      }
       emit('selected_variant',selectedVariant.productId);
    }

    function findMatchingVariant() {
      return products.find((product: any) => {
        const matches = Object.entries(selectedFeatures).every(([featureType, featureValue]) => 
          product.productFeatures.includes(`${featureType}/${featureValue}`)
        );
        return matches && product.isVariant === "true";
      });
    }

</script>