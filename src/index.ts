declare var process: any;

import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { DxpAppVersionInfo, DxpFacilitySwitcher, DxpGitBookSearch, DxpImage, DxpLanguageSwitcher, DxpLogin, DxpMenuFooterNavigation, DxpOmsInstanceNavigator, DxpPagination, DxpProductIdentifier, DxpProductStoreSelector, DxpShopifyImg, DxpTimeZoneSwitcher, DxpUserProfile } from "./components";
import { goToOms, getProductIdentificationValue, getAppLoginUrl, openPosScanner } from "./utils";
import { initialiseFirebaseApp } from "./utils/firebase"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { useUserStore } from "./store/user";
import { IonicVue } from '@ionic/vue';
import imagePreview from "./directives/imagePreview";
import { useFormValidator } from "./composables/useFormValidation";
import { useFieldValidator } from "./composables/useFieldValidation";

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
let facilityContext = {} as any
let productStoreContext = {} as any
let notificationContext = {} as any
let gitBookContext = {} as any
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
if(navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}

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
    app.use(IonicVue, {
      mode: 'md'
    })

    app.component('DxpAppVersionInfo', DxpAppVersionInfo)
    app.component('DxpFacilitySwitcher', DxpFacilitySwitcher)
    app.component('DxpGitBookSearch', DxpGitBookSearch)
    app.component('DxpImage', DxpImage)
    app.component('DxpLanguageSwitcher', DxpLanguageSwitcher)
    app.component('DxpLogin', DxpLogin)
    app.component('DxpMenuFooterNavigation', DxpMenuFooterNavigation)
    app.component('DxpOmsInstanceNavigator', DxpOmsInstanceNavigator)
    app.component('DxpPagination', DxpPagination)
    app.component('DxpProductIdentifier', DxpProductIdentifier)
    app.component('DxpProductStoreSelector', DxpProductStoreSelector)
    app.component('DxpShopifyImg', DxpShopifyImg)
    app.component('DxpTimeZoneSwitcher', DxpTimeZoneSwitcher)
    app.component('DxpUserProfile', DxpUserProfile)

    app.directive('image-preview', imagePreview)

    showToast = options.showToast

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    imageContext.defaultImgUrl = options.defaultImgUrl
    shopifyImgContext.defaultImgUrl = options.defaultImgUrl

    userContext.setUserLocale = options.setUserLocale

    // TimeZone specific api from oms-api package exposed by the app
    userContext.setUserTimeZone = options.setUserTimeZone
    userContext.getAvailableTimeZones = options.getAvailableTimeZones

    productIdentificationContext.getProductIdentificationPref = options.getProductIdentificationPref
    productIdentificationContext.setProductIdentificationPref = options.setProductIdentificationPref
    productIdentificationContext.fetchGoodIdentificationTypes = options.fetchGoodIdentificationTypes

    facilityContext.getUserFacilities = options.getUserFacilities
    facilityContext.setUserPreference = options.setUserPreference
    facilityContext.getUserPreference = options.getUserPreference
     
    productStoreContext.getEComStoresByFacility = options.getEComStoresByFacility
    productStoreContext.getEComStores = options.getEComStores
    productStoreContext.setUserPreference = options.setUserPreference
    productStoreContext.getUserPreference = options.getUserPreference

    notificationContext.addNotification = options.addNotification
    notificationContext.appFirebaseConfig = options.appFirebaseConfig
    notificationContext.appFirebaseVapidKey = options.appFirebaseVapidKey
    notificationContext.storeClientRegistrationToken = options.storeClientRegistrationToken

    gitBookContext.askQuery = options.askQuery
    gitBookContext.getGitBookPage = options.getGitBookPage
    gitBookContext.searchQuery = options.searchQuery

    loginContext.getConfig = options.getConfig
    loginContext.initialise = options.initialise

    appContext.Actions = options.Actions
    appContext.hasPermission = options.hasPermission

    // set a default locale in the state
    i18n.global.locale.value = useUserStore().getLocale

    translate = i18n.global.t
  }
}

export {
  appContext,
  DxpImage,
  DxpLogin,
  DxpMenuFooterNavigation,
  DxpOmsInstanceNavigator,
  DxpPagination,
  DxpProductIdentifier,
  DxpShopifyImg,
  DxpTimeZoneSwitcher,
  DxpUserProfile,
  getProductIdentificationValue,
  gitBookContext,
  goToOms,
  i18n,
  imageContext,
  initialiseFirebaseApp,
  loginContext,
  notificationContext,
  productIdentificationContext,
  facilityContext,
  productStoreContext,
  shopifyImgContext,
  translate,
  useAuthStore,
  useFieldValidator,
  useFormValidator,
  useProductIdentificationStore,
  useUserStore,
  userContext,
  getAppLoginUrl,
  openPosScanner
}
