import { defineStore } from "pinia";
import { DateTime } from 'luxon'

export const useAuthStore = defineStore('userAuth', {
  state: () => {
    return {
      token: {
        value: '',
        expiration: undefined
      },
      oms: ''
    }
  },
  getters: {
    getToken: (state) => state.token,
    getOms: (state) => state.oms,
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
