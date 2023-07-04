import { createPinia } from "pinia";
import { useProductIdentificationStore } from "./store/productIdentification";
import { useAuthStore } from "./store/auth";
import Login from "./components/Login";

// TODO: handle cases when the store from app or pinia store are not available
// creating a pinia store for the plugin
const pinia = createPinia();

let getAndSetUserDetails: Function
let loader: any
let getUserTokenAndOms: any
let confirmSessionEnd: Function
let logout: Function

// executed on app initialization
export let dxpComponents = {
  install(app: any, options: any) {
    // registering pinia in the app
    app.use(pinia);
    app.component('Login', Login)
    getAndSetUserDetails = options.getAndSetUserDetails
    getUserTokenAndOms = options.getUserTokenAndOms
    confirmSessionEnd = options.confirmSessionEnd
    logout = options.logout
    loader = options.loader
  }
}

export {
  useProductIdentificationStore,
  useAuthStore,
  Login,
  getAndSetUserDetails,
  getUserTokenAndOms,
  confirmSessionEnd,
  logout,
  loader
}
