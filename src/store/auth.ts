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
      maarg: "",
      isEmbedded: false,
      shop: undefined,
      host: undefined,
    }
  },
  getters: {
    getToken: (state) => state.token,
    getOms: (state) => state.oms,
    getBaseUrl: (state) => {
      let baseURL = state.oms
      let maarg = state.maarg
      const appConfig = loginContext.getConfig()

      if (maarg && appConfig.systemType === "MOQUI") return maarg.startsWith('http') ? maarg.includes('/rest/s1') ? maarg : `${maarg}/rest/s1/` : `https://${maarg}.hotwax.io/rest/s1/`;
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
    }
  },
  persist: true
})
