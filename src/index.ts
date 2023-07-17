import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useLocaleStore } from "./store/locale";
import ShopifyImg from "./components/ShopifyImg";
import { goToOms } from "./utils";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

let defaultImgUrl: string
let i18n: any
// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    // registering pinia in the app
    app.use(pinia);
    app.component('ShopifyImg', ShopifyImg)
    defaultImgUrl = options.defaultImgUrl
    i18n = options.i18n
  }
}

export {
  useProductIdentificationStore,
  useLocaleStore,
  defaultImgUrl,
  ShopifyImg,
  goToOms,
  i18n
}
