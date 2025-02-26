<template>
  <div>
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
import { sortSizes } from '../utils/apparel-sorter';
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { api } from "@hotwax/oms-api"

const props = defineProps(['productGroupId']);
const emit = defineEmits(['selected_variant']);

const products = ref([] as any[]);
const productGroupId = ref(props.productGroupId);
const isLoading = ref(false);
const productFeatures = ref({} as Record<string, string[]>);
const selectedFeatures = ref({} as Record<string, string>);
const selectedProductId = ref('');

onMounted(() => {
  fetchProductsByGroupId();
});

async function fetchProductsByGroupId() {
  isLoading.value = true;
  try {
    const response = await api({
      url: "https://dev-oms.hotwax.io/api/searchProducts",
      method: "post",
      data: {
        "filters": [
          `groupId: ${productGroupId.value} OR productId: ${productGroupId.value}`
        ],
        "viewSize": 50
      },
      cache: true
    });


    if (response?.data?.response?.docs && response.data.response.docs.length > 0) {
      products.value = response.data.response.docs;
      extractProductFeatures();
    } else {
      // console.warn('No products found or error in response');
    }
  } catch (error) {
    // console.error('Error fetching products:', error);
  } finally {
    isLoading.value = false;
  }
}

function extractProductFeatures() {
  const features: Record<string, string[]> = {};
  const mainProduct = products.value.find(product => product.productId === productGroupId.value);

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

  productFeatures.value = sortedFeatures;

  // Set initial selection to first option of each feature
  Object.keys(sortedFeatures).forEach(featureType => {
    selectedFeatures.value[featureType] = sortedFeatures[featureType][0];
  });

  // Set initial selected product ID
  const selectedVariant = findMatchingVariant();
  if (selectedVariant) {
    selectedProductId.value = selectedVariant.productId;
  }
}

function handleFeatureSelection(option: string, featureType: string) {
  selectedFeatures.value[featureType] = option;
  const selectedVariant = findMatchingVariant();
  if (selectedVariant) {
    selectedProductId.value = selectedVariant.productId;
  }
  emit('selected_variant', selectedVariant.productId);
}

function findMatchingVariant() {
  return products.value.find((product: any) => {
    const matches = Object.entries(selectedFeatures.value).every(([featureType, featureValue]) => 
      product.productFeatures.includes(`${featureType}/${featureValue}`)
    );
    return matches && product.isVariant === "true";
  });
}
</script>