import { createStore, useStore as useVuexStore } from "vuex"
import mutations  from './mutations'
import getters  from './getters'
import actions from './actions'
import RootState from './RootState'
import createPersistedState from "vuex-persistedstate";
import userModule from './modules/user';
import productModule from "./modules/product";
import SecureLS from "secure-ls";

// We will be using secure-ls for secure localStorage data with high level of encryption and data compression.
// (Package Link : https://www.npmjs.com/package/secure-ls)

// First we will be creating a instance of Securels where the constructor accepts a
// configurable object with all three keys being optional. The keys are as follows :
// 1. encodingType : the type of encoding technique we want to provide (base64/aes/des/rabbit/rc4/' ')
// 2. isCompression : whether we want to store the data in the compressed form or not (True/False)
// 3. encryptionSecret : encryptionSecret will only be used for the Encryption and Decryption 
//                       of data with AES, DES, RC4, RABBIT, and the library will discard it 
//                       if no encoding / Base64 encoding method is choosen.

const ls = new SecureLS({ encodingType: 'aes' , isCompression: true , encryptionSecret: process.env.VUE_APP_SECURITY_KEY});


// TODO check how to register it from the components only
// Handle same module registering multiple time on page refresh
//store.registerModule('user', userModule);


const state: any = {

}

const persistState = createPersistedState({
    paths: ['user'],
    fetchBeforeUse: true,
    storage: {
        getItem: key => {
            // Initially if data is not saved in localStorage in the encrypted form, then try block will
            // throw an error, which will be taken care in the catch setBlockTracking. In the catch block,
            // first we will will clear local storage and then proceed.
            try {
                return ls.get(key)
            } catch(err) {
                ls.remove(key)
                return ls.get(key)
            }
        },       
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
    }
})

// Added modules here so that hydration takes place before routing
const store = createStore<RootState>({
    state,
    actions,
    mutations,
    getters,
    plugins: [ persistState ],
    modules: { 
        'user': userModule,
        'product': productModule
    },
})

export default store
export function useStore(): typeof store {
    return useVuexStore()
}