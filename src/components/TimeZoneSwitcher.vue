<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ $t('Timezone') }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('The timezone you select is used to ensure automations you schedule are always accurate to the time you select.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label> {{ userProfile && userProfile.userTimeZone ? userProfile.userTimeZone : '-' }} </ion-label>
      <ion-button @click="changeTimeZone()" slot="end" fill="outline" color="dark">{{ $t("Change") }}</ion-button>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton, 
  modalController
} from '@ionic/vue';
import { appContext } from '../index';
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';

const appState = appContext.config.globalProperties.$store;
const userProfile = computed(() => appState.getters['user/getUserProfile'])

const changeTimeZone = async () => {
  const timeZoneModal = await modalController.create({
    component: defineAsyncComponent(() => import('./TimeZoneModal.vue')),
  });
  return timeZoneModal.present();
}
</script>