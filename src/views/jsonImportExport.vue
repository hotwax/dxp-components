<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>JSON Editor</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="exportJson()" :disabled=isDisabled>
              <ion-icon :icon="downloadOutline" slot="icon-only" />
            </ion-button>
          </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-margin-top">
      <ion-item lines="none" class="ion-margin-top">
        <ion-label>Select a .json file: {{ fileName }}</ion-label>
        <input type="file" accept=".json" @change="handleFileChange" style="display:none" id="fileInput"
          ref="fileInput">
        <ion-button expand="block" fill="outline" color="secondary" @click="$refs.fileInput.click()">
          Choose File
        </ion-button>
      </ion-item>
      <ion-segment v-model="selectedSegment" color="primary">
        <ion-segment-button value="replace">
          <ion-label>Replace</ion-label>
        </ion-segment-button>
        <ion-segment-button value="parameters">
          <ion-label>Parameters</ion-label>
        </ion-segment-button>
      </ion-segment>
      <main>
        <div v-if="selectedSegment === 'replace'">
          <ion-item>
            <ion-label position="floating" lines="none">Text to Replace</ion-label>
            <ion-input type="text" v-model="formData.currentText"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" lines="none">New Text</ion-label>
            <ion-input type="text" v-model="formData.updatedText"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="replaceJson()">
            Save
          </ion-button>
        </div>
        <div v-else-if="selectedSegment === 'parameters' && !importedJsonValue">
          <ion-item lines="none">
            <ion-label>No JSON selected</ion-label>
          </ion-item>
        </div>
        <div v-else-if="selectedSegment === 'parameters'">
          <ion-item v-for="(parameter, index) in parametersList" :key="index">
            <ion-label position="floating">{{ parameter.name }}</ion-label>
            <ion-input position="floating" v-model="parameter.value"></ion-input>
          </ion-item>
          <!-- <ion-fab vertical="bottom" horizontal="end">
            <ion-fab-button @click="updateParameters">
              <ion-icon name="save"  :icon="saveOutline"></ion-icon>
            </ion-fab-button>
          </ion-fab> -->
          <ion-button expand="block" @click="updateParameters()">
            Save
          </ion-button>
        </div>
      </main>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addMoreParameters()" :disabled=enableButtonToAddParameters()>
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { showToast } from '@/utils'
import { downloadOutline, saveOutline, addOutline } from 'ionicons/icons'
import saveAs from "file-saver";
import AddParametersModal from '@/components/AddParametersModal.vue'

export default defineComponent({
  components: {
    IonPage,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonSegment,
    IonSegmentButton
  },
  data() {
    return {
      formData: {
        currentText: '',
        updatedText: '',
      },
      importedJsonValue: null,
      OriginalJson: null,
      isDisabled: true,
      fileName: '',
      selectedSegment: 'replace',
      parametersList: [],
    };
  },
  methods: {
    getParameterValues() {
      if (this.importedJsonValue) {
        const parameters1 = this.importedJsonValue.parameterContexts['UCG HC Shopify Reconciliation'].parameters;
        this.parametersList = parameters1.map(parameters1 => ({
          name: parameters1.name,
          value: parameters1.value
        }));
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      this.fileName = file.name;
      reader.onload = (e) => {
        const jsonContent = e.target.result;
        try {
          this.importedJsonValue = JSON.parse(jsonContent);
          this.OriginalJson = JSON.parse(jsonContent);
          this.getParameterValues();
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    },
    replaceJson() {
      if (!this.importedJsonValue) {
        console.error('No JSON data available to modify and save.');
        showToast("No JSON data available to modify and save.");
        return;
      }

      const regex = new RegExp('\\b' + this.formData.currentText + '\\b', 'gi');

      // Check if the text to replace exists in the JSON data
      if (!regex.test(JSON.stringify(this.importedJsonValue))) {
        console.error('Text to replace does not exist in the JSON data.');
        showToast("Text to replace does not exist in the JSON data.");
        return;
      }

      // Replace the text while handling different cases
      this.importedJsonValue = JSON.parse(JSON.stringify(this.importedJsonValue).replace(regex, match => {
        // Convert the new text to the appropriate case based on the case of the matched text in JSON
        if (match.toUpperCase() === match) {
          // If the matched text is in uppercase in JSON, convert the new text to uppercase
          return this.formData.updatedText.toUpperCase();
        } else if (match.toLowerCase() === match) {
          // If the matched text is in lowercase in JSON, convert the new text to lowercase
          return this.formData.updatedText.toLowerCase();
        } else if (match[0].toUpperCase() === match[0]) {
          // If the first character of the matched text is capital in JSON, convert the new text to title case
          return this.formData.updatedText.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }).join(' ');
        } else {
          // Default case: replace with the new text as is
          return this.formData.updatedText;
        }
      }));
      if (this.importedJsonValue != this.OriginalJson) {
        this.isDisabled = false;
      }
      showToast("Data saved successfully");
      console.log(this.importedJsonValue);
      this.formData.currentText = '';
      this.formData.updatedText = '';
    },
    updateParameters() {
      if (!this.importedJsonValue) {
        console.error('No JSON data available to modify and save.');
        showToast("No JSON data available to modify and save.");
        return;
      }
      this.parametersList.forEach(parameter => {
        const parameterName = parameter.name;
        const parameterValue = parameter.value;
        this.importedJsonValue.parameterContexts['UCG HC Shopify Reconciliation'].parameters.find(p => p.name === parameterName).value = parameterValue;
      });
      if (this.importedJsonValue != this.OriginalJson) {
        this.isDisabled = false;
      }
      showToast("Data saved successfully");
    },
    async addMoreParameters() {
      console.log("coming or  ");
      const AddParameters = await modalController.create({
        component: AddParametersModal,
      });
      return AddParameters.present();
    },
    enableButtonToAddParameters() {
      if (this.selectedSegment === "replace")
        return true;
    },
    exportJson() {
      if (!this.importedJsonValue) {
        console.error('No JSON data available to export.');
        showToast("No JSON data available to export.");
        return;
      }
      const modifiedData = JSON.stringify(this.importedJsonValue, null, 2);
      const blob = new Blob([modifiedData], { type: 'application/json' });
      saveAs(blob, 'modified_data.json');
    }
  },
  setup() {
    return {
      downloadOutline,
      saveOutline,
      addOutline
    }
  }
});
</script>

<style scoped>
@media (min-width: 700px) {
  main {
    max-width: 375px;
    margin: auto;
  }
}
</style>
