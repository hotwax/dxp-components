<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ $t('Facility') }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('Specify which facility you want to operate from. Order, inventory and other configuration data will be specific to the facility you select.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ $t('Select facility') }}</ion-label>
      <ion-select interface="popover" :value="userAppState.currentFacility.facilityId" @ionChange="setFacility($event)">
        <ion-select-option v-for="facility in (userAppState.userProfile ? userAppState.userProfile.facilities : [])" :key="facility.facilityId" :value="facility.facilityId" >{{ facility.facilityName ? facility.facilityName : facility.name }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { appContext } from '../index';
import { computed } from 'vue';

// Here 'facility-change-alert' and 'update-facility-id' are the events for inventory-count app.
// and 'get-facility-details' is the event for fulfillment-pwa app.
const emit = defineEmits(['facility-change-alert', 'get-facility-details' ,'update-facility-id'])
const appState = appContext.config.globalProperties.$store;

const userAppState = computed(() => {
  return {
    currentFacility: appState.getters['user/getCurrentFacility'],
    userProfile: appState.getters['user/getUserProfile'],
    uploadProducts: appState.getters['product/getUploadProducts']
  }
});

const setFacility = async (event: any) => {
  const currentUserAppState = JSON.parse(JSON.stringify(userAppState.value))
  const selectedFacility = event['detail'].value

  if(currentUserAppState.currentFacility.facilityId && currentUserAppState.currentFacility.facilityId != selectedFacility && currentUserAppState.userProfile?.facilities) {
    // Below check is a handle case for the inventory-count app.
    if(appState.uploadProducts && Object.keys(appState.uploadProducts).length > 0 ) {
      emit('facility-change-alert', selectedFacility)
    } else {
      await appState.dispatch('user/setFacility', {
        'facility': currentUserAppState.userProfile.facilities.find((facility: any) => facility.facilityId == selectedFacility)
      });
      emit('update-facility-id', currentUserAppState.currentFacility.facilityId)
      emit('get-facility-details')
    }
  }
}
</script>