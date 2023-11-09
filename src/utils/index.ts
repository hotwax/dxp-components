import { toastController } from "@ionic/vue";
import { translate } from "src";

const goToOms = (token: string, oms: string) => {
  const link = (oms.startsWith('http') ? oms.replace(/api\/?/, "") : `https://${oms}.hotwax.io/`) + `commerce/control/main?token=${token}`
  
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
  const identification = product['goodIdentifications'].find((identification: string) => identification.startsWith(productIdentifier + "/"))

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

export {
  getProductIdentificationValue,
  goToOms,
  showToast
}