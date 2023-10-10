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
    async setLocale(newLocale: string) {
      try {
        // update locale in state and globally
        i18n.global.locale.value = newLocale
        this.locale = newLocale
        await userContext.setUserLocale({ newLocale })
      } catch (error) {
        console.error(error)
      }
    }
  },
  persist: true
})
