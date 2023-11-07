<template>
  <ion-footer>
    <ion-toolbar>
      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          <p class="overline">{{ instanceUrl }}</p>
        </ion-label>
        <ion-note :color="browserTimeZone === userAppState.userProfile?.userTimeZone ? '' : 'danger'" slot="end">{{ userAppState.userProfile?.userTimeZone }}</ion-note>
      </ion-item>
      <!-- showing product stores only when there are multiple options to choose from. -->
      <ion-item v-if="userAppState.userProfile?.stores?.length > 2" lines="none">
        <!-- WHY EVENTS ($emit) IS USED WITH ION CHANGE: https://michaelnthiessen.com/pass-function-as-prop/ -->
        <ion-select interface="popover" :value="userAppState.currentEComStore.productStoreId" @ionChange="$emit('updateEcomStore', $event)">
          <ion-select-option v-for="store in userAppState.userProfile.stores" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          {{ userAppState.currentEComStore.storeName }}
        </ion-label>
      </ion-item>
      <!-- similarly, showing shopify configs only when there are multiple options to choose from 
      but if both product store and config have multiple options, then only option to choose
      product store will be visible -->
      <ion-item v-if="userAppState.shopifyConfigs?.length > 1 && userAppState.userProfile?.stores?.length < 3" lines="none">
        <ion-select interface="popover" :value="userAppState.currentShopifyConfig?.shopifyConfigId" @ionChange="$emit('updateShopifyConfig', $event)">
          <ion-select-option v-for="shopifyConfig in userAppState.shopifyConfigs" :key="shopifyConfig.shopifyConfigId" :value="shopifyConfig.shopifyConfigId">{{ shopifyConfig.name ? shopifyConfig.name : shopifyConfig.shopifyConfigName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          <p>{{ userAppState.currentShopifyConfig.name ? userAppState.currentShopifyConfig.name : userAppState.currentShopifyConfig.shopifyConfigName }}</p>
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
const userAppState = computed(() => ({ 
  userProfile: appState.getters['user/getUserProfile'],
  currentEComStore: appState.getters['user/getCurrentEComStore'],
  shopifyConfigs: appState.getters['user/getShopifyConfigs'],
  currentShopifyConfig: appState.getters['user/getCurrentShopifyConfig']
}));

// Accessing browser timeZone to check for timeZone diff of the app and browser
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
</script>
