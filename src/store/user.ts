import { defineStore } from "pinia";
import { i18n } from "src";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      locale: '',
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" }
    }
  },
  getters: {
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions
  },
  actions: {
    setLocale(payload: string) {
      // update locale in state and globally
      i18n.global.locale = payload
      this.locale = payload
    }
  }
})
