<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ "Facility" }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ 'Specify which facility you want to operate from. Order, inventory and other configuration data will be specific to the facility you select.' }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ "Select facility" }}</ion-label>
      <ion-select interface="popover" :value="appUserState.currentFacility.facilityId" @ionChange="setFacility($event)">
        <ion-select-option v-for="facility in (appUserState.userProfile ? appUserState.userProfile.facilities : [])" :key="facility.facilityId" :value="facility.facilityId" >{{ facility.name }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue'
import { appContext } from '../index';
import { computed } from 'vue';

// Here 'facility-change-alert' and 'update-facility-id' are the events for inventory-count app.
// and 'get-facility-details' is the event for fulfillment-pwa app.
const emit = defineEmits(['facility-change-alert', 'get-facility-details' ,'update-facility-id'])
const store = appContext.config.globalProperties.$store;
const appUserState = computed(() => {
  return {
    currentFacility: store.getters['user/getCurrentFacility'],
    userProfile: store.getters['user/getUserProfile'],
    uploadProducts: store.getters['product/getUploadProducts']
  }
});

const setFacility = async (event: any) => {
  const currentAppUserState = appUserState.value
  const selectedFacility = event['detail'].value
  if (currentAppUserState.currentFacility.facilityId && currentAppUserState.currentFacility.facilityId != selectedFacility && currentAppUserState.userProfile?.facilities) {
    // Below check is a handle case for the inventory-count app.
    if (store.uploadProducts && Object.keys(store.uploadProducts).length > 0 ) {
      emit('facility-change-alert', selectedFacility)
    } else {
      await store.dispatch('user/setFacility', {
        'facility': currentAppUserState.userProfile.facilities.find((fac: any) => fac.facilityId == selectedFacility)
      });
      Promise.all([emit('update-facility-id', currentAppUserState.currentFacility.facilityId), emit('get-facility-details')])
    }
  }
}
</script>