declare var process: any;

import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'

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

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app

    // Creating an instance of the i18n and translate function for translating text
    i18n = createI18n({
      locale: process.env.VUE_APP_I18N_LOCALE || 'en',
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
      messages: options.localeMessages
    })
    translate = (key: string) => key ? i18n.global.t(key) : '';

    // registering pinia in the app
    app.use(pinia);
    app.use(i18n);

    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)

    loginContext.login = options.login
    loginContext.logout = options.logout
    loginContext.loader = options.loader
    loginContext.appLoginUrl = options.appLoginUrl

    shopifyImgContext.defaultImgUrl = options.defaultImgUrl
    productIdentificationContext.getProductIdentificationPref = options.getProductIdentificationPref
    productIdentificationContext.setProductIdentificationPref = options.setProductIdentificationPref
  }
}

export {
  appContext,
  goToOms,
  Login,
  loginContext,
  productIdentificationContext,
  useProductIdentificationStore,
  useAuthStore,
  shopifyImgContext,
  ShopifyImg,
  translate
}
