import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import Login from "./components/Login";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let loginContext = {} as any
let shopifyImgContext = {} as any

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    // registering pinia in the app
    app.use(pinia);

    app.component('Login', Login)
    app.component('ShopifyImg', ShopifyImg)

    loginContext.getAndSetUserDetails = options.getAndSetUserDetails
    loginContext.getUserTokenAndOms = options.getUserTokenAndOms
    loginContext.confirmSessionEnd = options.confirmSessionEnd
    loginContext.logout = options.logout
    loginContext.loader = options.loader

    shopifyImgContext.defaultImgUrl = options.defaultImgUrl
  }
}

export {
  useProductIdentificationStore,
  useAuthStore,
  Login,
  loginContext,
  shopifyImgContext,
  ShopifyImg,
  goToOms
}
