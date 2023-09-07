declare var process: any;
import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { translate } from './i18n';
import { createI18n } from 'vue-i18n'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let loginContext = {} as any
let shopifyImgContext = {} as any
let appContext = {} as any
let productIdentificationContext = {} as any
let i18nContext = {} as any

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app
    i18nContext.localeMessages = options.localeMessages;
    // registering pinia in the app
    app.use(pinia);
    app.use(createI18n({
      locale: process.env.VUE_APP_I18N_LOCALE || 'en',
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
      messages: options.localeMessages
    }));
    
    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)
    
    console.log('i18nContext',i18nContext);
    
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
  useProductIdentificationStore,
  useAuthStore,
  Login,
  loginContext,
  shopifyImgContext,
  ShopifyImg,
  goToOms,
  appContext,
  productIdentificationContext,
  i18nContext,
  translate
}
