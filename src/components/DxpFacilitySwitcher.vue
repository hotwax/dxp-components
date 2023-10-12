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

const emit = defineEmits(['before-set-facility', 'after-set-facility']);
const appState = appContext.config.globalProperties.$store;

const userAppState = computed(() => ({
  currentFacility: appState.getters['user/getCurrentFacility'],
  userProfile: appState.getters['user/getUserProfile']
}));

const setFacility = async (event: CustomEvent) => {
  const currentUserAppState = JSON.parse(JSON.stringify(userAppState.value))
  const facilityId = event.detail.value

  if(currentUserAppState.currentFacility.facilityId !== facilityId && currentUserAppState.userProfile?.facilities) {
    // before-set-facility is emitted before setFacility action.
    emit('before-set-facility', facilityId)

    await appState.dispatch('user/setFacility', {
      'facility': currentUserAppState.userProfile.facilities.find((facility: any) => facility.facilityId === facilityId)
    });

    // after-set-facility is emitted after setFacility action.
    emit('after-set-facility', facilityId)
  }
}
</script>