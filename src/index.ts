import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { useNotificationStore } from "./store/notification";
import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import { initialiseFirebaseApp, generateTopicName } from "./firebase-utils"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let loginContext = {} as any
let shopifyImgContext = {} as any
let appContext = {} as any
let productIdentificationContext = {} as any
let noitificationContext = {} as any

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app

    // registering pinia in the app
    app.use(pinia);

    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    shopifyImgContext.defaultImgUrl = options.defaultImgUrl
    productIdentificationContext.getProductIdentificationPref = options.getProductIdentificationPref
    productIdentificationContext.setProductIdentificationPref = options.setProductIdentificationPref

    noitificationContext.notificationApplicationId = options.notificationApplicationId
    noitificationContext.notificationEnumTypeId = options.notificationEnumTypeId
    noitificationContext.getNotificationEnumIds = options.getNotificationEnumIds
    noitificationContext.getNotificationUserPrefTypeIds = options.getNotificationUserPrefTypeIds
    noitificationContext.removeClientRegistrationToken = options.removeClientRegistrationToken
    noitificationContext.storeClientRegistrationToken = options.storeClientRegistrationToken
    noitificationContext.subscribeTopic = options.subscribeTopic
    noitificationContext.unsubscribeTopic = options.unsubscribeTopic

    loginContext.getConfig = options.getConfig
    loginContext.initialise = options.initialise
  }
}

export {
  appContext,
  generateTopicName,
  goToOms,
  initialiseFirebaseApp,
  Login,
  loginContext,
  productIdentificationContext,
  noitificationContext,
  ShopifyImg,
  shopifyImgContext,
  useProductIdentificationStore,
  useAuthStore,
  useNotificationStore
}
