declare var process: any;
import { createI18n } from 'vue-i18n'
import { i18nContext } from '../index';

const i18n = createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {}
})

// TODO Check if this is needed in updated versions
// Currently this method is added to be used in ts files
const translate = (key: string) => {
  if (!key) {
    return '';
  }
  return i18n.global.t(key);
};

export { i18n as default, translate }