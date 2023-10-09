import { defineStore } from "pinia";
import { i18n, userContext } from "../../src";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      appLoginUrl: process.env.VUE_APP_LOGIN_URL,
      appResourceUrl: process.env.VUE_APP_RESOURCE_URL,
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" },
      preference: {
        locale: 'en'
      } as any
    }
  },
  getters: {
    getAppLoginUrl: (state) => state.appLoginUrl,
    getAppResourceUrl: (state) => state.appResourceUrl,
    getLocale: (state) => state.preference.locale,
    getLocaleOptions: (state) => state.localeOptions
  },
  actions: {
    setLocale(payload: string) {
      // update locale in state and globally
      i18n.global.locale.value = payload
      this.setPreference({ locale: payload })
    },
    async setPreference(payload: any) {
      this.preference = { ...this.preference, ...payload }
      await userContext.setUserPreference({
        'userPrefTypeId': 'LOCALE_PREFERENCE',
        'userPrefValue': JSON.stringify(this.preference)
      })
    },
    async getPreference(token: any, baseURL: string) {
      try {
        this.preference = await userContext.getUserPreference(token, baseURL, 'LOCALE_PREFERENCE')
      } catch (error) {
        console.error(error)
      }
    }
  },
  persist: true
})
