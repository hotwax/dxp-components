import { defineComponent } from 'vue';
// import { useProductIdentificationStore } from '../store/productIdentification';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';

export default defineComponent({
  template: `<ion-card>
    <ion-card-header>
      <ion-card-title v-on:click="setProductIdentificationPreference('groupId', 'primaryId')">
        {{ 'Product Identifier' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      {{ 'Choosing a product identifier allows you to view products with your preferred identifiers.' }}
    </ion-card-content>

    <ion-item>
      <ion-label>{{ "Primary Product Identifier" }}</ion-label>
      <ion-select interface="popover" :placeholder="'primary identifier'" :value="primaryId" @ionChange="setProductIdentificationPreference($event.detail.value, 'primaryId')">
        <ion-select-option v-for="identification in options" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label>{{ "Secondary Product Identifier" }}</ion-label>
      <ion-select interface="popover" :placeholder="'secondary identifier'" :value="secondaryId" @ionChange="setProductIdentificationPreference($event.detail.value, 'secondaryId')">
        <ion-select-option v-for="identification in options" :key="identification" :value="identification" >{{ identification }}</ion-select-option>
        <ion-select-option value="">{{ "None" }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>`,

  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItem
  },

  data() {
    return {
      primaryId: 'productId',
      secondaryId: '',
      options: ['productId', 'groupId', 'parentProductName', 'Sku']
    }
  },

  methods: {
    setProductIdentificationPreference: function (value: string, id: string) {
      this.primaryId = value;
      console.log('id', id)
    }
  }

  // setup() {
  //   const productIdentificationStore = useProductIdentificationStore();

  //   console.log('inside setup function')

  //   // creating a ref for product identifications and use them in the template as when directly using the store getter the template section is not updated
  //   let primaryId = ref('productId')
  //   let secondaryId = ref('')

  //   productIdentificationStore.$subscribe((mutation, state) => {
  //     primaryId.value = state.productIdentificationPref.primaryId
  //     secondaryId.value = state.productIdentificationPref.secondaryId
  //   })

  //   console.log('')

  //   const productIdentifications = productIdentificationStore.productIdentificationOptions;

  //   function setProductIdentificationPreference(value: string, id: string) {
  //     console.log('set the identification from component', productIdentificationStore)
  //     // Not dispatching an action if the value for id is same as saved in state
  //     if((productIdentificationStore.getProductIdentificationPref as any)[id] == value) {
  //       return;
  //     }
  //     // await productIdentificationStore.setProductIdentificationPref(id, value, 'currentEComStore')
  //     console.log('done')
  //   }

  //   return {
  //     primaryId,
  //     productIdentificationStore,
  //     productIdentifications,
  //     secondaryId,
  //     setProductIdentificationPreference
  //   }
  // }
})
