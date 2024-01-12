import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, getFirestore, getDoc, setDoc, updateDoc } from "firebase/firestore";

let app;
let database = {} as any

const initialiseFirebaseApp = async (
  appFirebaseConfig: any,
  appFirebaseVapidKey: string,
  storeClientRegistrationToken: Function,
  addNotification: Function
) => {
  const firebaseConfig = appFirebaseConfig

  app = initializeApp(firebaseConfig);
  database = getFirestore(app);

  // Check for notifications required only in bopis app.
  if(addNotification) {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
  
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: appFirebaseVapidKey
      });
      await storeClientRegistrationToken(token)
  
      // handle foreground message
      onMessage(messaging, (payload: any) => {
        addNotification({ notification: payload, isForeground: true });
      });
  
      // handle background message (service worker)
      const broadcast = new BroadcastChannel('FB_BG_MESSAGES');
      broadcast.onmessage = (event) => {
        addNotification({ notification: event.data, isForeground: false });
      };
    } else {
      alert("You denied notifications.");
    }
  }
};

const getDocument = async (collection: any, document: any) => {
  const querySnapshot = await getDoc(doc(database, collection, document));
  return querySnapshot.data()
}

const addDocument = async (collection: any, document: any, data: any) => {
  return await setDoc(doc(database, collection, document), data);
}

const updateDocument = async (collection: any, document: any, data: any) => {
  return await updateDoc(doc(database, collection, document), data);
}

export {
  addDocument,
  initialiseFirebaseApp,
  getDocument,
  updateDocument
}