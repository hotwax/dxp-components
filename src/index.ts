declare var process: any;

import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { AppVersionInfo, DxpImage, DxpUserProfile, LanguageSwitcher, OmsInstanceNavigator, ProductIdentifier, Scanner, ShopifyImg } from "./components";
import Login from "./components/Login";
import { goToOms, getProductIdentificationValue } from "./utils";
import { initialiseFirebaseApp } from "./utils/firebase"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { useUserStore } from "./store/user";

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

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app

    // Creating an instance of the i18n and translate function for translating text
    i18n = createI18n({
      legacy: false,
      locale: process.env.VUE_APP_I18N_LOCALE || 'en',
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
      messages: options.localeMessages
    })

    // registering pinia in the app
    app.use(pinia);
    app.use(i18n);

    app.component('AppVersionInfo', AppVersionInfo)
    app.component('DxpImage', DxpImage)
    app.component('DxpUserProfile', DxpUserProfile)
    app.component('LanguageSwitcher', LanguageSwitcher)
    app.component('Login', Login)
    app.component('OmsInstanceNavigator', OmsInstanceNavigator)
    app.component('ProductIdentifier', ProductIdentifier)
    app.component('Scanner', Scanner)
    app.component('ShopifyImg', ShopifyImg)

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    imageContext.defaultImgUrl = options.defaultImgUrl
    shopifyImgContext.defaultImgUrl = options.defaultImgUrl

    userContext.getUserPreference = options.getUserPreference
    userContext.setUserPreference = options.setUserPreference

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
  DxpImage,
  DxpUserProfile,
  getProductIdentificationValue,
  goToOms,
  i18n,
  imageContext,
  initialiseFirebaseApp,
  Login,
  loginContext,
  notificationContext,
  OmsInstanceNavigator,
  ProductIdentifier,
  productIdentificationContext,
  ShopifyImg,
  shopifyImgContext,
  translate,
  useAuthStore,
  useProductIdentificationStore,
  Scanner,
  useUserStore,
  userContext
}
