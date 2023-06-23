import { UserService } from "../services/UserService";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('userAuth', {
  state: () => {
    return {
      token: '',
      oms: 'dev-oms'
    }
  },
  getters: {
    getToken: (state) => state.token,
    getOms: (state) => state.oms
  },
  actions: {
    isAuthenticated() {
			return this.token.length ? true : false
    },
		async login() {
      try {
        const resp = await UserService.login('hotwax.user', 'Hotwax@786')
        this.token = resp.data.token
      } catch (error) {
        console.log(error)        
      }
		}
  }
})
