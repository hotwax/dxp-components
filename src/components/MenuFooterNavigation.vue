<template>
  <ion-footer>
    <ion-toolbar>
      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          <p class="overline">{{ instanceUrl }}</p>
        </ion-label>
        <ion-note slot="end">{{ appUserState.userProfile?.userTimeZone }}</ion-note>
      </ion-item>
      <!-- showing product stores only when there are multiple options to choose from. -->
      <ion-item v-if="appUserState.userProfile?.stores?.length > 2" lines="none">
        <!-- WHY EVENTS ($emit) IS USED WITH ION CHANGE: https://michaelnthiessen.com/pass-function-as-prop/ -->
        <ion-select interface="popover" :value="appUserState.currentEComStore.productStoreId" @ionChange="$emit('updateEcomStore', $event)">
          <ion-select-option v-for="store in (appUserState.userProfile?.stores ? appUserState.userProfile.stores : [])" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          {{ appUserState.currentEComStore.storeName }}
        </ion-label>
      </ion-item>
      <!-- similarly, showing shopify configs only when there are multiple options to choose from 
      but if both product store and config have multiple options, then only option to choose
      product store will be visible -->
      <ion-item v-if="appUserState.shopifyConfigs?.length > 1 && appUserState.userProfile?.stores?.length < 3" lines="none">
        <ion-select interface="popover" :value="appUserState.currentShopifyConfig?.shopifyConfigId" @ionChange="$emit('updateShopifyConfig', $event)">
          <ion-select-option v-for="shopifyConfig in appUserState.shopifyConfigs" :key="shopifyConfig.shopifyConfigId" :value="shopifyConfig.shopifyConfigId">{{ shopifyConfig.name ? shopifyConfig.name : shopifyConfig.shopifyConfigName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          <p>{{ appUserState.currentShopifyConfig.name ? appUserState.currentShopifyConfig.name : appUserState.currentShopifyConfig.shopifyConfigName }}</p>
        </ion-label>
      </ion-item>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonItem, IonLabel, IonNote, IonSelect, IonSelectOption, IonToolbar } from '@ionic/vue';
import { appContext, useAuthStore } from "../index";
import { computed } from 'vue';

const authStore = useAuthStore();
const appState = appContext.config.globalProperties.$store;
const instanceUrl = computed(() => authStore.getOms); 
const appUserState = computed(() => {
  return {
    userProfile: appState.getters['user/getUserProfile'],
    currentEComStore: appState.getters['user/getCurrentEComStore'],
    shopifyConfigs: appState.getters['user/getShopifyConfigs'],
    currentShopifyConfig: appState.getters['user/getCurrentShopifyConfig']
  }
});
</script>
