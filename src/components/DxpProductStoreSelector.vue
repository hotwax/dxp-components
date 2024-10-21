<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>
        {{ $t("Product Store") }}
      </ion-card-subtitle>
      <ion-card-title>
        {{ $t("Store") }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ $t('A store represents a company or a unique catalog of products. If your OMS is connected to multiple eCommerce stores selling different collections of products, you may have multiple Product Stores set up in HotWax Commerce.') }}
    </ion-card-content>

    <ion-item lines="none">
      <ion-select :label="$t('Select store')" interface="popover" :placeholder="$t('store name')" :value="currentEComStore?.productStoreId" @ionChange="updateEComStore($event.target.value)">
        <ion-select-option v-for="store in (eComStores ? eComStores : [])" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>
    
<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { useUserStore } from 'src';
import { computed } from 'vue';

const userStore = useUserStore();
const emit = defineEmits(["updateEcomStore"])

const eComStores = computed(() => userStore.getProductStores); 
const currentEComStore = computed(() => userStore.getCurrentEComStore);

async function updateEComStore(eComStoreId: any) {
  if (eComStoreId && currentEComStore.value?.productStoreId !== eComStoreId) {
    const selectedProductStore = eComStores.value.find((store: any) => store.productStoreId == eComStoreId)
    await userStore.setEComStorePreference(selectedProductStore)
    emit('updateEcomStore', selectedProductStore)
  }
}
</script>