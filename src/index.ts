import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import ShopifyCDNImage from "./components/ShopifyCDNImage";
import { goToOms } from "./utils";

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();

let defaultImgUrl: string
// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    // registering pinia in the app
    app.use(pinia);
    app.component('ShopifyCDNImage', ShopifyCDNImage)
    defaultImgUrl = options.defaultImgUrl
  }
}

export {
  useProductIdentificationStore,
  defaultImgUrl,
  ShopifyCDNImage,
  goToOms
}
