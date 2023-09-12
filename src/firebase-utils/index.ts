import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useNotificationStore } from "../store/notification";
import { DateTime } from 'luxon'

const initialiseFirebaseApp = async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAq-jeG6dy8y2O6p_RYKk_MpkfTZ97GF_Q",
    authDomain: "hotwax-digital-commerce.firebaseapp.com",
    databaseURL: "https://hotwax-digital-commerce.firebaseio.com",
    projectId: "hotwax-digital-commerce",
    storageBucket: "hotwax-digital-commerce.appspot.com",
    messagingSenderId: "211268342110",
    appId: "1:211268342110:web:6fa33f0d16129925c27fcf"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BOUIEOumNzijvdsEaG2x3fCmQIupqlvq0tJS4QQSF7C1xrCYC6fYJ-VQWkKKPCZN4GG1jVIVMtdiUVjvbeOXO6w"
    });
    const notificationStore = useNotificationStore()

    // TODO handle case - if (!token) 
    notificationStore.deviceId = generateDeviceId()
    await notificationStore.storeClientRegistrationToken(token)

    // handle foreground message
    onMessage(messaging, (payload: any) => {
      notificationStore.addNotification(payload);
    });

    // handle background message (service worker)
    const broadcast = new BroadcastChannel('FB_BG_MESSAGES');
    broadcast.onmessage = (event) => {
      notificationStore.addNotification(event.data);
    };
  } else if (permission === "denied") {
    alert("You denied notifications.");
  }
};

const generateDeviceId = () => {
  // device ID: <DDMMYY><timestamp[6]>
  return (DateTime.now().toFormat('ddMMyy') + String(DateTime.now().toMillis()).slice(-6))
}

const generateTopicName = (oms: string, productStoreId: string, enumId: string) => {
  // topic name: oms-productStoreId-enumId(enumCode)
  return `${oms}-${productStoreId}-${enumId}`
}

export {
  generateTopicName,
  initialiseFirebaseApp,
  generateDeviceId
}