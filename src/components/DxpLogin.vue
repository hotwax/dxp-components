<template>
  <ion-content>
    <div class="center-div">
      <ion-item lines="none" v-if='error.message.length'>
        <ion-icon slot="start" color="warning" :icon="warningOutline" />
        <h4>{{ $t('Login failed') }}</h4>
      </ion-item>
      <p v-if='error.responseMessage.length'>
        {{ $t('Reason:') }} {{ $t(error.responseMessage) }}
      </p>
      <p v-if='error.message.length'>
        {{ $t(error.message) }}
      </p>
      <ion-button v-if='error.message.length' class="ion-margin-top" @click="goToLaunchpad()">
        <ion-icon slot="start" :icon="arrowBackOutline" />
        {{ $t("Back to Launchpad") }}
      </ion-button>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem
} from "@ionic/vue";
import { arrowBackOutline, warningOutline } from 'ionicons/icons'
import { initialiseFirebaseApp } from "../utils/firebase"
import {
  loginContext as context,
  useAuthStore,
  appContext,
  loginContext,
  notificationContext,
  useUserStore
} from "../index"
import { DateTime } from "luxon"
declare var process: any;

const authStore = useAuthStore()
const router = appContext.config.globalProperties.$router
const route = appContext.config.globalProperties.$route
const error = ref({
  message: '',
  responseMessage: ''
})

onMounted(async () => {
  if (!Object.keys(route.query).length) {
    window.location.href = context.appLoginUrl
    return
  }

  const { token, oms, expirationTime, omsRedirectionUrl } = route.query
  await handleUserFlow(token, oms, expirationTime, omsRedirectionUrl)
});

async function handleUserFlow(token: string, oms: string, expirationTime: string, omsRedirectionUrl = "") {
  // fetch the current config for the user
  const appConfig = loginContext.getConfig()

  // logout to clear current user state, don't mark the user as logout as we just want to clear the user data
  await context.logout({ isUserUnauthorised: true })

  // reset the config that we got from the oms-api, as on logout we clear the config of oms-api
  await context.initialise(appConfig)

  // checking if token from launchpad has expired and redirecting there only
  if (+expirationTime < DateTime.now().toMillis()) {
    console.error('User token has expired, redirecting to launchpad.')
    error.value.message = 'User token has expired, redirecting to launchpad.'
    const redirectUrl = window.location.origin + '/login' // current app URL
    window.location.href = `${context.appLoginUrl}?isLoggedOut=true&redirectUrl=${redirectUrl}`
    return
  }

  // update the previously set values if the user opts ending the previous session
  authStore.$patch({
    token: { value: token, expiration: expirationTime as any },
    oms
  })

  context.loader.present('Logging in')
  try {
    // redirect route will be returned for certain cases
    const redirectRoute = await context.login({ token, oms, omsRedirectionUrl })

    const userStore = useUserStore()
    // to access baseUrl as we store only OMS in DXP
    const appState = appContext.config.globalProperties.$store
    await userStore.setLocale(appState.getters['user/getUserProfile'].userLocale)

    const allNotificationPrefs = appState.getters['user/getAllNotificationPrefs']

    // check if firebase configurations are there
    if (notificationContext.appFirebaseConfig && notificationContext.appFirebaseConfig.apiKey && allNotificationPrefs.length) {
      // initialising and connecting firebase app for notification support
      await initialiseFirebaseApp(
        notificationContext.appFirebaseConfig,
        notificationContext.appFirebaseVapidKey,
        notificationContext.storeClientRegistrationToken,
        notificationContext.addNotification,
      )
    }

    redirectRoute ? router.push(redirectRoute) : router.push('/')
  } catch (err: any) {
    console.error(err)
    error.value.message = 'Please contact the administrator.'
    error.value.responseMessage = err.message || ''
  } finally {
    context.loader.dismiss()
  }
}

function goToLaunchpad() {
  window.location.href = `${process.env.VUE_APP_LOGIN_URL}`
}
</script>

<style>
.center-div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>