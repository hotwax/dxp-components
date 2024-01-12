declare var process: any;

import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { DxpAppVersionInfo, DxpImage, DxpLanguageSwitcher, DxpLogin, DxpMenuFooterNavigation, DxpOmsInstanceNavigator, DxpProductIdentifier, DxpShopifyImg, DxpUserProfile } from "./components";
import { goToOms, getProductIdentificationValue } from "./utils";
import { addDocument, getDocument, initialiseFirebaseApp, updateDocument } from "./utils/firebase"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { useUserStore } from "./store/user";

import "./service-worker"

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let i18n: any
let imageContext = {} as any
let translate: any;
let loginContext = {} as any
let shopifyImgContext = {} as any
let appContext = {} as any
let productIdentificationContext = {} as any
let notificationContext = {} as any
let userContext = {} as any
let showToast = {} as any

let refreshing = false;

const updateAvailable = ($event: any) => {
  const registration = $event.detail;
  const updateExists = true;
  appContext.config.globalProperties.$store.dispatch('user/updatePwaState', { registration, updateExists });
  showToast(translate("New version available, please update the app."));
}

document.addEventListener('swUpdated', updateAvailable, { once: true })
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return
  refreshing = true
  window.location.reload()
})

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app

    // Creating an instance of the i18n and translate function for translating text
    i18n = createI18n({
      legacy: false,
      locale: process.env.VUE_APP_I18N_LOCALE || 'en-US',
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
      messages: options.localeMessages
    })

    // registering pinia in the app
    app.use(pinia);
    app.use(i18n);

    app.component('DxpAppVersionInfo', DxpAppVersionInfo)
    app.component('DxpImage', DxpImage)
    app.component('DxpLanguageSwitcher', DxpLanguageSwitcher)
    app.component('DxpLogin', DxpLogin)
    app.component('DxpMenuFooterNavigation', DxpMenuFooterNavigation)
    app.component('DxpOmsInstanceNavigator', DxpOmsInstanceNavigator)
    app.component('DxpProductIdentifier', DxpProductIdentifier)
    app.component('DxpShopifyImg', DxpShopifyImg)
    app.component('DxpUserProfile', DxpUserProfile)

    showToast = options.showToast

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    imageContext.defaultImgUrl = options.defaultImgUrl
    shopifyImgContext.defaultImgUrl = options.defaultImgUrl

    userContext.setUserLocale = options.setUserLocale

    productIdentificationContext.getProductIdentificationPref = options.getProductIdentificationPref
    productIdentificationContext.setProductIdentificationPref = options.setProductIdentificationPref
    
    notificationContext.addNotification = options.addNotification
    notificationContext.appFirebaseConfig = options.appFirebaseConfig
    notificationContext.appFirebaseVapidKey = options.appFirebaseVapidKey
    notificationContext.storeClientRegistrationToken = options.storeClientRegistrationToken

    loginContext.getConfig = options.getConfig
    loginContext.initialise = options.initialise

    // set a default locale in the state
    i18n.global.locale.value = useUserStore().getLocale

    translate = i18n.global.t
  }
}

export {
  appContext,
  addDocument,
  DxpImage,
  DxpLogin,
  DxpMenuFooterNavigation,
  DxpOmsInstanceNavigator,
  DxpProductIdentifier,
  DxpShopifyImg,
  DxpUserProfile,
  getDocument,
  getProductIdentificationValue,
  goToOms,
  i18n,
  imageContext,
  initialiseFirebaseApp,
  loginContext,
  notificationContext,
  productIdentificationContext,
  shopifyImgContext,
  translate,
  updateDocument,
  useAuthStore,
  useProductIdentificationStore,
  useUserStore,
  userContext
}
