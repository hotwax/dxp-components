<template>
  <div class="user-profile">
    <ion-card>
      <ion-item lines="full">
        <ion-avatar slot="start" v-if="userProfile?.partyImageUrl">
          <Image :src="userProfile.partyImageUrl"/>
        </ion-avatar>
        <!-- ion-no-padding to remove extra side/horizontal padding as additional padding 
        is added on sides from ion-item and ion-padding-vertical to compensate the removed
        vertical padding -->
        <ion-card-header class="ion-no-padding ion-padding-vertical">
          <ion-card-subtitle>{{ userProfile.userLoginId }}</ion-card-subtitle>
          <ion-card-title>{{ userProfile.partyName }}</ion-card-title>
        </ion-card-header>
      </ion-item>
      <ion-button color="danger" @click="logout()">{{ $t("Logout") }}</ion-button>
      <ion-button fill="outline" @click="goToLaunchpad()">
        {{ $t("Go to Launchpad") }}
        <ion-icon slot="end" :icon="openOutline" />
      </ion-button>
      <!-- Commenting this code as we currently do not have reset password functionality -->
      <!-- <ion-button fill="outline" color="medium">{{ $t("Reset password") }}</ion-button> -->
    </ion-card>
  </div>
</template>
<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem
} from '@ionic/vue';
// import Image from '@/components/Image.vue';
import { openOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { appContext } from '../index';
import { useUserStore } from '../store/user'

const userStore = useUserStore();
const appState = appContext.config.globalProperties.$store;

const userProfile = computed(() => appState.getters['user/getUserProfile']);
const appLoginUrl = computed(() => userStore.getAppLoginUrl).value;

const logout = () => {
  appState.dispatch('user/logout').then(() => {
    appState.dispatch('shipment/clearShipments');
    appState.dispatch('return/clearReturns');
    appState.dispatch("party/resetReceiversDetails");
    console.log(window.location.origin);
    const redirectUrl = window.location.origin + '/login'
    window.location.href = `${appLoginUrl}?isLoggedOut=true&redirectUrl=${redirectUrl}`
  })
}

const goToLaunchpad = () => {
  window.location.href = appLoginUrl;
}
</script>