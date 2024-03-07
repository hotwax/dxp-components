<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>JSON Editor</ion-title>
        <ion-buttons slot="end">
      <ion-button @click="exportJson()" :disabled = isDisabled >
        <ion-icon :icon="downloadOutline" slot="icon-only" />
      </ion-button>
    </ion-buttons>
      </ion-toolbar>
    </ion-header>
     
    <ion-content class="ion-margin-top">
      <ion-item lines="none" class="ion-margin-top">
        <ion-label >Select a .json file: {{ nameOfFile }}</ion-label>
        <input type="file" accept=".json" @change="handleFileChange" style="display:none" id="fileInput" ref="fileInput">
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
            <ion-input type="text" v-model="formData.textToReplace"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" lines="none">New Text</ion-label>
            <ion-input type="text" v-model="formData.newText"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="replaceJson()">
            Save
          </ion-button>
        </div>
        <div v-else-if="selectedSegment === 'parameters' && !jsonToBemodified">
          <ion-item lines="none">
            <ion-label>No JSON selected</ion-label>
          </ion-item>
        </div>
        <div v-else-if="selectedSegment === 'parameters'">
          <ion-item v-for="(parameter, index) in parameterValues" :key="index">
            <ion-label position="floating">{{ parameter.name }}</ion-label>
            <ion-input position="floating" v-model="parameter.value"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="updateParameters">
            Save
          </ion-button>
        </div>
      </main> 
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
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import { showToast } from '@/utils'
import { downloadOutline } from 'ionicons/icons'
import saveAs from "file-saver";

export default defineComponent({
  components: {
    IonPage,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonSegment,
    IonSegmentButton },
  data() {
    return {  
      formData: {
        textToReplace: '',
        newText: '',
      },
      jsonToBemodified: null,
      OriginalJson: null,
      isDisabled: true,
      nameOfFile: '',
      selectedSegment: 'replace', 
      parameterValues: [],
    };
  },
  methods: {
    getParameterValues() {
      if (this.jsonToBemodified) {
        const parameters1 = this.jsonToBemodified.parameterContexts['UCG HC Shopify Reconciliation'].parameters;
        this.parameterValues = parameters1.map(parameters1 => ({
          name: parameters1.name,
          value: parameters1.value
        }));
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      this.nameOfFile = file.name;
      reader.onload = (e) => {
        const jsonContent = e.target.result;
        try {
          this.jsonToBemodified = JSON.parse(jsonContent);
          this.OriginalJson = JSON.parse(jsonContent);
          this.getParameterValues();
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    },
    replaceJson() {
      if (!this.jsonToBemodified) {
        console.error('No JSON data available to modify and save.');
        showToast("No JSON data available to modify and save.");
        return;
      }

      const regex = new RegExp('\\b' + this.formData.textToReplace + '\\b', 'gi');

      // Check if the text to replace exists in the JSON data
      if (!regex.test(JSON.stringify(this.jsonToBemodified))) {
        console.error('Text to replace does not exist in the JSON data.');
        showToast("Text to replace does not exist in the JSON data.");
        return;
      }

      // Replace the text while handling different cases
      this.jsonToBemodified = JSON.parse(JSON.stringify(this.jsonToBemodified).replace(regex, match => {
        // Convert the new text to the appropriate case based on the case of the matched text in JSON
        if (match.toUpperCase() === match) {
          // If the matched text is in uppercase in JSON, convert the new text to uppercase
          return this.formData.newText.toUpperCase();
        } else if (match.toLowerCase() === match) {
          // If the matched text is in lowercase in JSON, convert the new text to lowercase
          return this.formData.newText.toLowerCase();
        } else if (match[0].toUpperCase() === match[0]) {
          // If the first character of the matched text is capital in JSON, convert the new text to title case
          return this.formData.newText.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }).join(' ');
        } else {
          // Default case: replace with the new text as is
          return this.formData.newText;
        }
      }));
      if(this.jsonToBemodified != this.OriginalJson) {
        this.isDisabled = false;
      }
      showToast("Data saved successfully");
      console.log(this.jsonToBemodified);
      this.formData.textToReplace = '';
      this.formData.newText = '';
    },
    updateParameters() {
      if (!this.jsonToBemodified) {
        console.error('No JSON data available to modify and save.');
        showToast("No JSON data available to modify and save.");
        return;
      }
      this.parameterValues.forEach(parameter => {
        const parameterName = parameter.name;
        const parameterValue = parameter.value;
        this.jsonToBemodified.parameterContexts['UCG HC Shopify Reconciliation'].parameters.find(p => p.name === parameterName).value = parameterValue;
      });
      if(this.jsonToBemodified != this.OriginalJson) {
        this.isDisabled = false;
      }
      showToast("Data saved successfully");
    },
    // enableExport() {
    //   if(this.jsonToBemodified != this.OriginalJson)
    //   {
    //     this.isDisabled = false;
    //   }
    // },
    exportJson() {
      if (!this.jsonToBemodified) {
        console.error('No JSON data available to export.');
        showToast("No JSON data available to export.");
        return;
      }
      const modifiedData = JSON.stringify(this.jsonToBemodified, null, 2);
      const blob = new Blob([modifiedData], { type: 'application/json' });
      saveAs(blob, 'modified_data.json');
    }
  },
  setup() {
    return {
      downloadOutline,
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
