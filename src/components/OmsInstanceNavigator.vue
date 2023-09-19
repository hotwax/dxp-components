<template>
  <!-- Todo: need to add translation to all the text once implemented in dxp-component -->
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>
        {{ "OMS instance" }}
      </ion-card-subtitle>
      <ion-card-title>
        {{ authStore.getOms }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ 'This is the name of the OMS you are connected to right now. Make sure that you are connected to the right instance before proceeding.' }}
    </ion-card-content>
    <ion-button @click="goToOms(authStore.getToken.value, authStore.getOms)" fill="clear">
      {{ 'Go to OMS' }}
      <ion-icon slot="end" :icon="openOutline" />
    </ion-button>
  </ion-card>
</template>

<script setup lang="ts">
import { 
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon } from '@ionic/vue';
import { goToOms } from '../utils';
import { openOutline } from 'ionicons/icons'
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore()
</script>