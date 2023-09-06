
<template>
  <ion-footer>
    <ion-toolbar>
      <ion-item lines="none">
        <ion-label class="ion-text-wrap">
          <p class="overline">{{ userStore.getInstanceUrl }}</p>
        </ion-label>
        <ion-note slot="end">{{ userStore.getUserProfile?.userTimeZone }}</ion-note>
      </ion-item>
      <!-- showing product stores only when there are multiple options to choose from. -->
      <ion-item v-if="userStore.getUserProfile?.stores?.length > 2" lines="none">
        <ion-select interface="popover" :value="userStore.getCurrentEComStore.productStoreId" @ionChange="$emit('changeEcomStore', $event)">
          <ion-select-option v-for="store in (userStore.getUserProfile?.stores ? userStore.getUserProfile.stores : [])" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          {{ userStore.getCurrentEComStore.storeName }}
        </ion-label>
      </ion-item>
      <!-- similarly, showing shopify configs only when there are multiple options to choose from 
      but if both product store and config have multiple options, then only option to choose
      product store will be visible -->
      <ion-item v-if="userStore.getShopifyConfigs?.length > 1 && userStore.getUserProfile?.stores?.length < 3" lines="none">
        <ion-select interface="popover" :value="userStore.getCurrentShopifyConfig?.shopifyConfigId" @ionChange="$emit('changeShopifyConfig', $event)">
          <ion-select-option v-for="shopifyConfig in userStore.getShopifyConfigs" :key="shopifyConfig.shopifyConfigId" :value="shopifyConfig.shopifyConfigId">{{ shopifyConfig.name ? shopifyConfig.name : shopifyConfig.shopifyConfigName }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else lines="none">
        <ion-label class="ion-text-wrap">
          <p>{{ userStore.getCurrentShopifyConfig.name ? userStore.getCurrentShopifyConfig.name : userStore.getCurrentShopifyConfig.shopifyConfigName }}</p>
        </ion-label>
      </ion-item>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonItem, IonLabel, IonNote, IonSelect, IonSelectOption, IonToolbar } from '@ionic/vue';
import { useUserStore } from "../index";

const userStore: any = useUserStore();

</script>
