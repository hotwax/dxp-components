
<template>
  <ion-footer>
    <ion-toolbar>
      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          <p class="overline">{{ instanceUrl }}</p>
        </ion-label>
        <ion-note slot="end">{{ userProfile?.userTimeZone }}</ion-note>
      </ion-item>
      <!-- showing product stores only when there are multiple options to choose from. -->
      <ion-item v-if="userProfile?.stores?.length > 2" lines="none">
        <ion-select interface="popover" :value="currentEComStore.productStoreId" @ionChange="$emit('changeEcomStore', $event)">
          <ion-select-option v-for="store in (userProfile?.stores ? userProfile.stores : [])" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          {{ currentEComStore.storeName }}
        </ion-label>
      </ion-item>
      <!-- similarly, showing shopify configs only when there are multiple options to choose from 
      but if both product store and config have multiple options, then only option to choose
      product store will be visible -->
      <ion-item v-if="shopifyConfigs?.length > 1 && userProfile?.stores?.length < 3" lines="none">
        <ion-select interface="popover" :value="currentShopifyConfig?.shopifyConfigId" @ionChange="$emit('changeShopifyConfig', $event)">
          <ion-select-option v-for="shopifyConfig in shopifyConfigs" :key="shopifyConfig.shopifyConfigId" :value="shopifyConfig.shopifyConfigId">{{ shopifyConfig.name ? shopifyConfig.name : shopifyConfig.shopifyConfigName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          <p>{{ currentShopifyConfig.name ? currentShopifyConfig.name : currentShopifyConfig.shopifyConfigName }}</p>
        </ion-label>
      </ion-item>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonItem, IonLabel, IonNote, IonSelect, IonSelectOption, IonToolbar } from '@ionic/vue';
import { appContext } from "../index";
import { computed } from 'vue';

const instanceUrl = computed(() => {
  return appContext.config.globalProperties.$store.getters['user/getInstanceUrl'];
});
const userProfile = computed(() => {
  return appContext.config.globalProperties.$store.getters['user/getUserProfile'];
});
const currentEComStore = computed(() => {
  return appContext.config.globalProperties.$store.getters['user/getCurrentEComStore'];
});
const shopifyConfigs = computed(() => {
  return appContext.config.globalProperties.$store.getters['user/getShopifyConfigs'];
});
const currentShopifyConfig = computed(() => {
  return appContext.config.globalProperties.$store.getters['user/getCurrentShopifyConfig'];
});

</script>
