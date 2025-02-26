<template>
  <div>
    <ion-spinner v-if="isLoading" name="crescent" />
    <div v-else>
      <ion-list v-for="(featureOptions, featureType) in productFeatures" :key="featureType">
        <ion-list-header>{{ featureType }}</ion-list-header>
        <ion-item lines="none">
          <ion-row>
            <ion-chip v-for="option in featureOptions" :key="option" :outline="selectedFeatures[featureType] !== option"
              @click="handleFeatureSelection(option, featureType)">
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
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { useProductFeatureStore } from '../store/productFeature';

const props = defineProps(['productGroupId']);
const emit = defineEmits(['selected_variant']);

const productFeatureStore = useProductFeatureStore();
const isLoading = computed(() => productFeatureStore.getIsLoading);
const productFeatures = ref({} as Record<string, string[]>);
const selectedFeatures = ref({} as Record<string, string>);
const selectedProductId = ref('');

onMounted(async () => {
  const products = await productFeatureStore.fetchProductsByGroupId(props.productGroupId);
  extractProductFeatures(products);
});

function extractProductFeatures(products: any[]) {
  const features: Record<string, string[]> = {};
  const mainProduct = products.find(product => product.productId === props.productGroupId);

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
  const selectedVariant = findMatchingVariant(products);
  if (selectedVariant) {
    selectedProductId.value = selectedVariant.productId;
  }
}

function handleFeatureSelection(option: string, featureType: string) {
  selectedFeatures.value[featureType] = option;
  const selectedVariant = findMatchingVariant(productFeatureStore.getProducts(props.productGroupId));
  if (selectedVariant) {
    selectedProductId.value = selectedVariant.productId;
  }
  emit('selected_variant', selectedVariant.productId);
}

function findMatchingVariant(products: any[]) {
  return products.find((product: any) => {
    const matches = Object.entries(selectedFeatures.value).every(([featureType, featureValue]) =>
      product.productFeatures.includes(`${featureType}/${featureValue}`)
    );
    return matches && product.isVariant === "true";
  });
}
</script>