import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";

import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import { initialiseFirebaseApp } from "./utils/firebase"

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { AppVersionInfo, ProductIdentifier } from "./components";

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

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

    // registering pinia in the app
    app.use(pinia);

    app.component('AppVersionInfo', AppVersionInfo)
    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)
    app.component('ProductIdentifier', ProductIdentifier)

    translate = options.translate;

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
  }
}

export {
  appContext,
  goToOms,
  initialiseFirebaseApp,
  Login,
  loginContext,
  productIdentificationContext,
  noitificationContext,
  ShopifyImg,
  shopifyImgContext,
  translate,
  useProductIdentificationStore,
  useAuthStore,
  ProductIdentifier
}
