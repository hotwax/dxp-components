import { modalController, toastController } from "@ionic/vue";
import { DateTime } from "luxon";
import { translate, useAuthStore } from "src";
import DxpGitBookSearch from "../components/DxpGitBookSearch.vue";
import { computed, ref } from "vue";
import { Plugins } from '@capacitor/core';

declare var process: any;

const goToOms = (token: string, oms: string) => {
  const link = (oms.startsWith('http') ? oms.replace(/\/api\/?|\/$/, "") : `https://${oms}.hotwax.io`) + `/commerce/control/main?token=${token}`
  
  window.open(link, '_blank', 'noopener, noreferrer')
}

const getProductIdentificationValue = (productIdentifier: string, product: any) => {
  // handled this case as on page load initially the data is not available, so not to execute furthur code
  // untill product is not available
  if(!Object.keys(product).length) {
    return;
  }

  let value = product[productIdentifier]

  // considered that the goodIdentification will always have values in the format "productIdentifier/value" and there will be no entry like "productIdentifier/"
  const identification = product['goodIdentifications']?.find((identification: string) => identification.startsWith(productIdentifier + "/"))

  if(identification) {
    const goodIdentification = identification.split('/')
    value = goodIdentification[1]
  }

  return value;
}

const showToast = async (message: string, configButtons?: any) => {
  const defaultButtons = [{
    text: 'Dismiss',
    role: 'cancel'
  }]

  if (configButtons) defaultButtons.push(...configButtons);

  const toast = await toastController
    .create({
      message: message,
      duration: 3000,
      position: 'bottom',
      buttons: defaultButtons
    })
  return toast.present();
}

// TimeZone format = 04:16 PM EDT
const getCurrentTime = (zone: string, format = 't ZZZZ') => {
  return DateTime.now().setZone(zone).toFormat(format)
}

//Copy to clipboard
const copyToClipboard = async (value: string, text?: string) => {
  const { Clipboard } = Plugins;

  await Clipboard.write({
    string: value,
  }).then(() => {
    text ? showToast(translate(text)) : showToast(translate("Copied", { value }));
  });
}
const getAppLoginUrl = () => {
  const authStore = useAuthStore();
  if (authStore.isEmbedded) {
    return `${process.env.VUE_APP_EMBEDDED_LAUNCHPAD_URL}/?shop=${authStore.shop}&host=${authStore.host}`
  } else {
    return process.env.VUE_APP_LOGIN_URL
  }
}

export {
  getCurrentTime,
  getProductIdentificationValue,
  goToOms,
  showToast,
  copyToClipboard,
  getAppLoginUrl
}