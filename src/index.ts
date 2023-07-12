import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import ShopifyImg from "./components/ShopifyImg";
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
    app.component('ShopifyImg', ShopifyImg)
    defaultImgUrl = options.defaultImgUrl
  }
}

export {
  useProductIdentificationStore,
  defaultImgUrl,
  ShopifyImg,
  goToOms
}
