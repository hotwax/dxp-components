import { defineStore } from "pinia";
import { i18n, userContext } from "../../src";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" },
      locale: 'en'
    }
  },
  getters: {
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions
  },
  actions: {
    setLocale(payload: string) {
      // update locale in state and globally
      i18n.global.locale.value = payload
      this.setPreference({ locale: payload })
    },
    async setPreference(payload: any) {
      this.locale = payload
      await userContext.setUserLocale({
        "newLocale": payload
      })
    }
  },
  persist: true
})
