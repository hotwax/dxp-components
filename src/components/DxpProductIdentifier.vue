<template>
  <!-- TODO: implement support for i18n -->
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ 'Product Identifier' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ 'Choosing a product identifier allows you to view products with your preferred identifiers.' }}
    </ion-card-content>

    <ion-item :disabled="!appContext.hasPermission(appContext.Actions.APP_PRODUCT_IDENTIFIER_UPDATE)">
      <ion-select :label="$t('Primary')" interface="popover" :placeholder="'primary identifier'" :value="productIdentificationPref.primaryId" @ionChange="setProductIdentificationPref($event.detail.value, 'primaryId')">
        <ion-select-option v-for="identification in productIdentificationOptions" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item lines="none" :disabled="!appContext.hasPermission(appContext.Actions.APP_PRODUCT_IDENTIFIER_UPDATE)">
      <ion-select :label="$t('Secondary')" interface="popover" :placeholder="'secondary identifier'" :value="productIdentificationPref.secondaryId" @ionChange="setProductIdentificationPref($event.detail.value, 'secondaryId')">
        <ion-select-option v-for="identification in productIdentificationOptions" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
        <ion-select-option value="">{{ "None" }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
import { appContext } from 'src';
import { useProductIdentificationStore } from 'src/store/productIdentification';
import { computed, onMounted } from 'vue';

const productIdentificationStore = useProductIdentificationStore();

const appState = appContext.config.globalProperties.$store
const eComStore = computed(() => appState.getters['user/getCurrentEComStore'])
const productIdentificationPref = computed(() => productIdentificationStore.getProductIdentificationPref);
const productIdentificationOptions = productIdentificationStore.getProductIdentificationOptions;

onMounted(() => {
  productIdentificationStore.getIdentificationPref(eComStore.value.productStoreId);
})

function setProductIdentificationPref(value: string | any, id: string) {
  productIdentificationStore.setProductIdentificationPref(id, value, eComStore.value.productStoreId)
}

</script>
