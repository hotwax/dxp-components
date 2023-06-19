import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();

// executed on app initialization
export let dxpComponents = {
  install(app: any) {
    // registering pinia in the app
    app.use(pinia);
  }
}

export {
  useProductIdentificationStore
}
