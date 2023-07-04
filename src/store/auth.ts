import { UserService } from "../services/UserService";
import { defineStore } from "pinia";
import { hasError } from "@hotwax/oms-api";

export const useAuthStore = defineStore('userAuth', {
  state: () => {
    return {
      token: {
        value: '',
        expiry: null
      },
      oms: 'dev-oms'
    }
  },
  getters: {
    getToken: (state) => state.token,
    getOms: (state) => state.oms,
    isAuthenticated: (state) => state.token.value.length > 0
  },
  actions: {
    /**
     * For authentication in route guard
     */
		async authenticate() {
      try {
        // authenticate through cookies
        this.token.value = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyTG9naW5JZCI6ImhvdHdheC51c2VyIiwiaXNzIjoiSG90V2F4IiwiZXhwIjoxNjg4NDY4NTU3LCJpYXQiOjE2ODgzODIxNTd9.czfRthWsv82F4V9Uq79u3NJ1ziOiME8nlO4y0ITSkvugBxA15jVWqd0q8Grh86Utt2qX6T3-vUEDlivKJ6b6vw'
        return this.token
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * For login using username and password through launchpad
     */
    async login() {
      try {
        // get token, oms, etc from query and
        // push them into the route from launchpad
        const resp = await UserService.login('aaron.wagner', 'hotwax@786')
        // set token and auth data
        if (!hasError(resp)) this.token.value = resp.data.token
        return this.token
      } catch (error) {
        console.log(error)
      }
    }
  }
})
