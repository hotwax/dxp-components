<template>
  <div class="user-profile">
    <ion-card>
      <ion-item lines="full">
        <ion-avatar slot="start" v-if="userProfile?.partyImageUrl">
          <DxpImage :src="userProfile.partyImageUrl"/>
        </ion-avatar>
        <!-- ion-no-padding to remove extra side/horizontal padding as additional padding 
        is added on sides from ion-item and ion-padding-vertical to compensate the removed
        vertical padding -->
        <ion-card-header class="ion-no-padding ion-padding-vertical">
          <ion-card-subtitle>{{ userProfile.userLoginId }}</ion-card-subtitle>
          <ion-card-title>{{ userProfile.partyName }}</ion-card-title>
        </ion-card-header>
      </ion-item>
      <ion-button color="danger" @click="logout()">{{ logoutLabel }}</ion-button>
      <ion-button fill="outline" @click="goToLaunchpad()">
        {{ goToLabel }}
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
import { DxpImage } from './index';
import { openOutline } from 'ionicons/icons';
import { appContext } from '../index';

declare let process: any;

const appState = appContext.config.globalProperties.$store;

defineProps({
  userProfile: {
    type: Object,
    required: true
  },
  logoutLabel: {
    type: String,
    default: 'Logout'
  },
  goToLabel: {
    type: String,
    default: 'Go To Launchpad'
  }
})
const emit = defineEmits(['before-logout']);
const appLoginUrl = process.env.VUE_APP_LOGIN_URL;

const logout = () => {
  // Emit to handle actions and resets performed by apps before logout.
  emit('before-logout')
  
  appState.dispatch('user/logout').then(() => {
    const redirectUrl = window.location.origin + '/login'
    window.location.replace(`${appLoginUrl}?isLoggedOut=true&redirectUrl=${redirectUrl}`)
  })
}

const goToLaunchpad = () => {
  window.location.href = appLoginUrl;
}
</script>

<style scoped>
.user-profile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}
</style>