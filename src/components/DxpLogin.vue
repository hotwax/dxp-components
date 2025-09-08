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
import { createShopifyAppBridge, getAppLoginUrl, getSessionTokenFromShopify } from "src/utils";
import { shopifyAppUserLogin } from "@hotwax/oms-api";
declare var process: any;

const authStore = useAuthStore()
const router = appContext.config.globalProperties.$router
const route = appContext.config.globalProperties.$route
const error = ref({
  message: '',
  responseMessage: ''
})

onMounted(async () => {
  // This will be false for when apps run in browser directly and when user first time comes from Shopify POS or Admin embedded app.
  let isEmbedded = authStore.isEmbedded;

  // Cases Handled: 
  // If the app is not embedded and there are no query params, redirect to launchpad
  // If the app is embedded, it will have query params from Shopify, even if the app is not marked as embedded in the auth store, we will mark it as embedded here.
  // In case if the token expired and user is routed to login path, the app was already marked as embedded, so we should not redirect to launchpad in that case.
  if (!isEmbedded && !Object.keys(route.query).length) {
    window.location.replace(context.appLoginUrl)
    return
  }

  const { token, oms, expirationTime, omsRedirectionUrl, embedded, shop, host } = route.query
  console.log("This is route and it's query: ", route, " and. ", route.query);
  isEmbedded = isEmbedded || embedded === '1'

  if (isEmbedded) {
    await appBridgeLogin(shop as string, host as string);
  } else {
    // Update the flag in auth, since the store is updated app login url will be embedded luanchpad's url.
    await handleUserFlow(token, oms, expirationTime, omsRedirectionUrl, isEmbedded, shop, host);
  }
});

async function handleUserFlow(token: string, oms: string, expirationTime: string, omsRedirectionUrl = "", isEmbedded: boolean, shop: string, host: string, shopifyAppBridge: any = undefined) {
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

    // This will be the url of referer launchpad, we maintain two launchpads.
    // The launchpad urls are defined the env file in each PW App. 
    // Setting this flag here because it is needed to identify the launchpad's URL, this will updated in this function later.
    authStore.isEmbedded = isEmbedded
    authStore.shop = shop
    authStore.host = host
    const appLoginUrl = getAppLoginUrl()
    if (isEmbedded) {
      window.location.replace(appLoginUrl)
    } else {
      const redirectUrl = window.location.origin + '/login' // current app URL
      window.location.replace(`${appLoginUrl}?isLoggedOut=true&redirectUrl=${redirectUrl}`)
    }
    return
  }

  // update the previously set values if the user opts ending the previous session
  authStore.$patch({
    token: { value: token, expiration: expirationTime as any },
    oms,
    isEmbedded,
    shop: shop as any,
    host: host as any,
    shopifyAppBridge: shopifyAppBridge as any
  })

  context.loader.present('Logging in')
  try {
    // redirect route will be returned for certain cases
    const redirectRoute = await context.login({ token, oms, omsRedirectionUrl})

    const userStore = useUserStore()
    // to access baseUrl as we store only OMS in DXP
    const appState = appContext.config.globalProperties.$store
    await userStore.setLocale(appState.getters['user/getUserProfile'].userLocale)

    const allNotificationPrefs = appState.getters['user/getAllNotificationPrefs']

    // check if firebase configurations are there
    if (notificationContext.appFirebaseConfig && notificationContext.appFirebaseConfig.apiKey && allNotificationPrefs?.length) {
      // initialising and connecting firebase app for notification support
      await initialiseFirebaseApp(
        notificationContext.appFirebaseConfig,
        notificationContext.appFirebaseVapidKey,
        notificationContext.storeClientRegistrationToken,
        notificationContext.addNotification,
      )
    }
    router.replace(redirectRoute ? redirectRoute : '/')
  } catch (err: any) {
    console.error(err)
    error.value.message = 'Please contact the administrator.'
    error.value.responseMessage = err.message || ''
  } finally {
    context.loader.dismiss()
  }
}

function goToLaunchpad() {
  window.location.replace(getAppLoginUrl())
}

async function appBridgeLogin(shop: string, host: string) {
  // In case where token expired and user is routed login path, the query params will not have shop and host,
  // So we get them from auth store before it is cleared.
  if (!shop) {
    shop = authStore.shop
  }
  if (!host) {
    host = authStore.host
  }
  if (!shop || !host) {
    console.error("Shop or host is missing, cannot proceed further.");
    error.value.message = "Please contact the administrator.";
    return;
  }
  console.log("This is shop and host: ", shop, " and ", host);
  const loginPayload = {} as any;
  let loginResponse;
  const maargUrl = JSON.parse(process.env.VUE_APP_SHOPIFY_SHOP_CONFIG)[shop].maarg;
  let shopifyAppBridge;
  try {
    shopifyAppBridge = await createShopifyAppBridge(shop, host);
    console.log("This is app bridge config : ", shopifyAppBridge);
    const shopifySessionToken = await getSessionTokenFromShopify(shopifyAppBridge);
    console.log("This is Shopify Session Token: ", shopifySessionToken);
    const appState: any = await shopifyAppBridge.getState();
    // Since the Shopify Admin doesn't provide location and user details,
    // we are using the app state to get the POS location and user details in case of POS Embedded Apps.
    loginPayload.sessionToken = shopifySessionToken;
    if (appState.pos?.location?.id) {
      loginPayload.locationId = appState.pos.location.id
    }
    if (appState.pos?.user?.firstName) {
      loginPayload.firstName = appState.pos.user.firstName;
    }
    if (appState.pos?.user?.lastName) {
      loginPayload.lastName = appState.pos.user.lastName;
    }
    console.log("***********This is login payload: ", loginPayload);
    // This is the maarg url mapped with the shop domain.
    console.log("This is maarg url: ", maargUrl)

    loginResponse = await shopifyAppUserLogin(authStore.getBaseUrl, loginPayload);

    if (!loginResponse?.data?.token) {
      throw "Login response doesn't have token, cannot proceed further.";
    }
  } catch (e) {
    console.error("Error ", e);
    error.value.message = "Please contact the administrator.";
    return;
  }

  console.log("This is login response : ", loginResponse.data);
  const loginToken = loginResponse.data.token;
  const omsInstanceUrl = loginResponse.data.omsInstanceUrl;
  const expiresAt = loginResponse.data.expiresAt;
  const appConfig: any = loginContext.getConfig();
  console.log("This is app config: ", appConfig);
  // If the system type is MOQUI then we need to pass the baseURL as oms and omsInstanceUrl as redirection url
  // If the system type is not MOQUI then we need to pass the omsInstanceUrl as oms and baseURL as redirection url
  const isMoquiFirst = appConfig.systemType === "MOQUI";
  await handleUserFlow(loginToken, isMoquiFirst ? maargUrl : omsInstanceUrl, expiresAt, isMoquiFirst ? omsInstanceUrl : maargUrl, true, shop, host, shopifyAppBridge);
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