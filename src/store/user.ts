import { defineStore } from "pinia";
import { i18n } from "src";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      appLoginUrl: process.env.VUE_APP_LOGIN_URL,
      appResourceUrl: process.env.VUE_APP_RESOURCE_URL,
      locale: '',
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" }
    }
  },
  getters: {
    getAppLoginUrl: (state) => state.appLoginUrl,
    getAppResourceUrl: (state) => state.appResourceUrl,
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
