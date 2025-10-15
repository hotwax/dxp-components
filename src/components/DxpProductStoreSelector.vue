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
    
    <ion-list lines="none" v-if="eComStores.length === 0">
      <ion-item v-if="appContext.hasPermission(appContext.Actions.APP_FACILITY_EDIT_PERMISSION)">
        <div class="facility-route" >
          {{ $t(`There are no Product Stores linked to`) }} {{ currentFacility.facilityName }}.
          <ion-button fill="clear" @click="gotoFacilityDetails">{{ $t("Finish facility setup") }}</ion-button>
        </div>
        <ion-icon :icon="openOutline" slot="end"></ion-icon>
      </ion-item>
      <ion-item v-else>
        <ion-label color="medium">{{ $t("There are no Product Stores linked to") }} {{ currentFacility.facilityName }} {{ $t(". Please contact your admin to finish this facilities setup") }}</ion-label>
        <ion-button fill="clear" color="medium" @click="copyToClipboard(copyPermissionErrorMessage, $t('Support request link copied to clipboard'))"> 
          <ion-icon :icon="copyOutline" slot="end"></ion-icon>
        </ion-button> 
      </ion-item>
    </ion-list>
    <ion-item lines="none" v-else>
      <ion-select :label="$t('Select store')" interface="popover" :placeholder="$t('store name')" :value="currentEComStore?.productStoreId" @ionChange="updateEComStore($event.target.value)">
        <ion-select-option v-for="store in (eComStores ? eComStores : [])" :key="store.productStoreId" :value="store.productStoreId">{{ store.storeName }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>
    
<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { appContext, useUserStore } from 'src';
import { computed } from 'vue';
import { copyOutline, openOutline } from "ionicons/icons";
import { copyToClipboard } from 'src/utils';

const userStore = useUserStore();
const emit = defineEmits(["updateEComStore"])

const eComStores = computed(() => userStore.getProductStores); 
const currentEComStore = computed(() => userStore.getCurrentEComStore);
const currentFacility = computed(()=>userStore.getCurrentFacility)
const copyPermissionErrorMessage = "https://docs.hotwax.co/documents/system-admins/administration/facilities/manage-product-stores"

function gotoFacilityDetails(){
  const facilityDetailsUrl = `https://facilities.hotwax.io/facility-details/${currentFacility.value.facilityId}`
  window.location.href = facilityDetailsUrl
}
async function updateEComStore(eComStoreId: any) {
  const selectedProductStore = eComStores.value.find((store: any) => store.productStoreId == eComStoreId)
  await userStore.setEComStorePreference(selectedProductStore)
  emit('updateEComStore', selectedProductStore)
}
</script>