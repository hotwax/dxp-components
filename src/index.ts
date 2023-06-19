import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import ProductIdentifier from "./components/ProductIdentifier";
import { App } from "vue";
import Sample from "./components/Sample"
import { IonicVue } from '@ionic/vue';
import Test from './components/Test.vue'

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();

// executed on app initialization
export let dxpComponents = {
  install(Vue: any) {
    // registering pinia in the app
    Vue.use(pinia).use(IonicVue);
    Vue.component('ProductIdentifier', ProductIdentifier)
    Vue.component('Sample', Sample)
    Vue.component('Test', Test)
  }
}

export {
  useProductIdentificationStore,
  ProductIdentifier,
  Sample,
  Test
}
