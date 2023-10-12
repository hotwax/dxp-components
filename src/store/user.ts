import { defineStore } from "pinia";
import { i18n, userContext } from "../../src";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en-US": "English" },
      locale: 'en-US'
    }
  },
  getters: {
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions
  },
  actions: {
    async setLocale(locale: string) {
      let newLocale, matchingLocale
      // handling if locale is not coming from userProfile
      if (!locale) {
        newLocale = this.locale
      } else {
        matchingLocale = Object.keys(this.localeOptions).find((option: string) => option === locale)
        // If exact locale is not found, try to match the first two characters i.e primary code
        matchingLocale = matchingLocale || Object.keys(this.localeOptions).find((option: string) => option.slice(0, 2) === locale.slice(0, 2))
        newLocale = matchingLocale || this.locale
      }

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
