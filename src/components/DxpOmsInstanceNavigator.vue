<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>
        {{ $t('OMS instance') }}
      </ion-card-subtitle>
      <ion-card-title>
        {{ authStore.getOms }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('This is the name of the OMS you are connected to right now. Make sure that you are connected to the right instance before proceeding.') }}
    </ion-card-content>
    <ion-button :class="{ 'pwa-hidden': !appContext.hasPermission(appContext.Actions.APP_PWA_STANDALONE_ACCESS) }" @click="goToOms(token.value, oms)" fill="clear" :disabled="!appContext.hasPermission(appContext.Actions.APP_COMMERCE_VIEW)">
      {{ $t('Go to OMS') }}
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
  IonIcon
} from '@ionic/vue';
import { goToOms } from '../utils';
import { openOutline } from 'ionicons/icons'
import { computed } from 'vue';
import { useAuthStore } from "../store/auth";
import { appContext } from "src";

const authStore = useAuthStore();

const token = computed(() => authStore.getToken)
const oms = computed(() => authStore.getOms)
</script>

<style scoped>
/* Added conditional hiding in standalone mode that respects user permissions */
@media (display-mode: standalone) {
  .pwa-hidden {
    display: none;
  }
}
</style>