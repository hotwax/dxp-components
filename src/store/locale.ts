import { defineStore } from "pinia";
import { i18n } from "../index";

export const useLocaleStore = defineStore('locale', {
  state: () => {
    return {
      value: 'en' // default value
    }
  },
  getters: {
    getLocale: (state) => state.value
  },
  actions: {
    setLocale(value: string) {
      this.value = i18n.global.locale = value
    }
  },
  persist: true
})
