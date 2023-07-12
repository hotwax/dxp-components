import { defineStore } from "pinia";
import { DateTime } from 'luxon'

export const useAuthStore = defineStore('userAuth', {
  state: () => {
    return {
      token: {
        value: '',
        expiration: undefined
      },
      oms: 'dev-oms'
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
  actions: {
		async authenticate() {
      try {
        // authenticate through cookies
        this.token.value = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyTG9naW5JZCI6ImhvdHdheC51c2VyIiwiaXNzIjoiSG90V2F4IiwiZXhwIjoxNjg4NDY4NTU3LCJpYXQiOjE2ODgzODIxNTd9.czfRthWsv82F4V9Uq79u3NJ1ziOiME8nlO4y0ITSkvugBxA15jVWqd0q8Grh86Utt2qX6T3-vUEDlivKJ6b6vw'
        return this.token
      } catch (error) {
        console.log(error)
      }
    }
  }
})
