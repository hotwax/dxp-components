<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ 'Product Identifier' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ 'Choosing a product identifier allows you to view products with your preferred identifiers.' }}
    </ion-card-content>

    <ion-item>
      <ion-label>{{ "Primary Product Identifier" }}</ion-label>
      <ion-select interface="popover" :placeholder="'primary identifier'" :value="productIdentification.pref.primaryId" @ionChange="setProductIdentificationPref($event.detail.value, 'primaryId')">
        <ion-select-option v-for="identification in productIdentification.options" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label>{{ "Secondary Product Identifier" }}</ion-label>
      <ion-select interface="popover" :placeholder="'secondary identifier'" :value="productIdentification.pref.secondaryId" @ionChange="setProductIdentificationPref($event.detail.value, 'secondaryId')">
        <ion-select-option v-for="identification in productIdentification.options" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
        <ion-select-option value="">{{ "None" }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/vue"
import { appContext } from "src";
import { useProductIdentificationStore } from "src/store/productIdentification";
import { computed, onMounted } from "vue";

const productIdentificationStore = useProductIdentificationStore(); // pinia store for product identification
const store = appContext.config.globalProperties.$store // vuex store from the app

const productIdentification: any = computed(() => {
  return {
    options: productIdentificationStore.getProductIdentificationOptions,
    pref: productIdentificationStore.getProductIdentificationPref
  }
})

const appUserState: any = computed(() => {
  console.log(store.getters['user/getCurrentEComStore'])
  
  return {
    instanceUrl: store.getters['user/getInstanceUrl'],
    userProfile: store.getters['user/getUserProfile'],
    currentEComStore: store.getters['user/getCurrentEComStore'],
    shopifyConfigs: store.getters['user/getShopifyConfigs'],
    currentShopifyConfig: store.getters['user/getCurrentShopifyConfig']
  }
});

onMounted(() => {
  console.log('inside component mounuted hook')
  productIdentificationStore.getIdentificationPref(appUserState.value.currentEComStore?.productStoreId);
})

function setProductIdentificationPref(value: string, id: string) {
  // If productPreference value is same as ion change value then not calling the set function as there is no change 
  if(appUserState.value.currentEComStore?.productStoreId && (productIdentification.value.pref[id] !== value)){
    productIdentificationStore.setProductIdentificationPref(id, value, appUserState.value.currentEComStore?.productStoreId)
      .then(() => {
        console.log("Product identifier preference updated");
      })
      .catch(error => console.log(error)); 
  }
}
</script>