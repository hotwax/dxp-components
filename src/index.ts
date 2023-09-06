import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import { useUserStore } from "./store/user";
import Login from "./components/Login";
import { MenuFooterNavigation } from "./components";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let loginContext = {} as any
let shopifyImgContext = {} as any
let appContext = {} as any
let productIdentificationContext = {} as any

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    appContext = app

    // registering pinia in the app
    app.use(pinia);

    app.component('Login', Login)
    app.component('MenuFooterNavigation', MenuFooterNavigation)
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
  loginContext,
  Login,
  MenuFooterNavigation,
  productIdentificationContext,
  useAuthStore,
  useProductIdentificationStore,
  useUserStore,
  ShopifyImg,
  shopifyImgContext,
}
