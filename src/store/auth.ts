import { defineStore } from "pinia";
import { DateTime } from 'luxon'
import { loginContext } from "src";

export const useAuthStore = defineStore('userAuth', {
  state: () => {
    return {
      token: {
        value: '',
        expiration: undefined
      },
      oms: '',
      isEmbedded: false,
      shop: undefined,
      host: undefined,
      shopifyAppBridge: undefined,
      posContext: {
        locationId: undefined,
        firstName: "",
        lastName: ""
      }
    }
  },
  getters: {
    getToken: (state) => state.token,
    getOms: (state) => state.oms,
    getBaseUrl: (state) => {
      let baseURL = state.oms
      const appConfig = loginContext.getConfig()

      if (baseURL && appConfig.systemType === "MOQUI") return baseURL.startsWith('http') ? baseURL.includes('/rest/s1') ? baseURL : `${baseURL}/rest/s1/` : `https://${baseURL}.hotwax.io/rest/s1/`;
      else if (baseURL) return baseURL.startsWith('http') ? baseURL.includes('/api') ? baseURL : `${baseURL}/api/` : `https://${baseURL}.hotwax.io/api/`;

      return "";
    },
    isAuthenticated: (state) => {
      let isTokenExpired = false
      if (state.token.expiration) {
        const currTime = DateTime.now().toMillis()
        isTokenExpired = state.token.expiration < currTime
      }
      return state.token.value && !isTokenExpired
    },
    getPosContext: (state) => {
      return state.posContext
    }
  },
  persist: true
})
