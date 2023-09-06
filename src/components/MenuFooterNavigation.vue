
<template>
  <ion-footer>
    <ion-toolbar>
      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          <p class="overline">{{ appUserState.instanceUrl }}</p>
        </ion-label>
        <ion-note slot="end">{{ appUserState.userProfile?.userTimeZone }}</ion-note>
      </ion-item>
      <!-- showing product stores only when there are multiple options to choose from. -->
      <ion-item v-if="appUserState.userProfile?.stores?.length > 2" lines="none">
        <ion-select interface="popover" :value="appUserState.currentEComStore.productStoreId" @ionChange="$emit('changeEcomStore', $event)">
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
        <ion-select interface="popover" :value="appUserState.currentShopifyConfig?.shopifyConfigId" @ionChange="$emit('changeShopifyConfig', $event)">
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
import { appContext } from "../index";
import { computed } from 'vue';

const store = appContext.config.globalProperties.$store;
const appUserState = computed(() => {
  return {
    instanceUrl: store.getters['user/getInstanceUrl'],
    userProfile: store.getters['user/getUserProfile'],
    currentEComStore: store.getters['user/getCurrentEComStore'],
    shopifyConfigs: store.getters['user/getShopifyConfigs'],
    currentShopifyConfig: store.getters['user/getCurrentShopifyConfig']
  }
});

</script>
