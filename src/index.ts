declare var process: any;

import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { LanguageSwitcher } from "./components";
import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import { initialiseFirebaseApp } from "./utils/firebase"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import { useUserStore } from "./store/user";
import { ProductIdentifier } from "./components";

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let i18n: any
let translate: any;
let loginContext = {} as any
let shopifyImgContext = {} as any
let appContext = {} as any
let productIdentificationContext = {} as any
let noitificationContext = {} as any

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

    app.component('LanguageSwitcher', LanguageSwitcher)
    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)
    app.component('ProductIdentifier', ProductIdentifier)

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    shopifyImgContext.defaultImgUrl = options.defaultImgUrl
    productIdentificationContext.getProductIdentificationPref = options.getProductIdentificationPref
    productIdentificationContext.setProductIdentificationPref = options.setProductIdentificationPref
    
    noitificationContext.addNotification = options.addNotification
    noitificationContext.appFirebaseConfig = options.appFirebaseConfig
    noitificationContext.appFirebaseVapidKey = options.appFirebaseVapidKey
    noitificationContext.storeClientRegistrationToken = options.storeClientRegistrationToken

    loginContext.getConfig = options.getConfig
    loginContext.initialise = options.initialise

    // set a default locale in the state
    useUserStore().setLocale(i18n.global.locale);
    translate = i18n.global.t
  }
}

export {
  Login,
  ShopifyImg,
  appContext,
  goToOms,
  i18n,
  loginContext,
  productIdentificationContext,
  shopifyImgContext,
  translate,
  useAuthStore,
  useProductIdentificationStore,
  useUserStore,
  initialiseFirebaseApp,
  noitificationContext,
  ProductIdentifier
}
