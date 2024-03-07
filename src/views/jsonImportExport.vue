<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>JSON Editor</ion-title>
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
        
        <div v-else-if="selectedSegment === 'parameters'">
          <ion-item v-for="(parameter, index) in parameterValues" :key="index">
          <ion-label position="floating">{{ parameter.name }}</ion-label>
          <ion-input position="floating" v-model="parameter.value"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="updateParameters">
            Save
          </ion-button>
        </div>
        <ion-button expand="block" @click="exportJson" class="ion-margin-top">Export</ion-button>
      </main> 
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSegment, IonSegmentButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import { showToast } from '@/utils'

export default defineComponent({
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSegment, IonSegmentButton },
  data() {
    return {  
      formData: {
        textToReplace: '',
        newText: '',
      },
      jsonData: null,
      nameOfFile: '',
      selectedSegment: 'replace', 
      parameterValues: [],
    };
  },
  methods: {
    getParameterValues() {
      if (this.jsonData) {
        const parameters1 = this.jsonData.parameterContexts['UCG HC Shopify Reconciliation'].parameters;
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
          this.jsonData = JSON.parse(jsonContent);
          this.getParameterValues();
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    },
    replaceJson() {
    if (!this.jsonData) {
      console.error('No JSON data available to modify and save.');
      showToast("No JSON data available to modify and save.");
      return;
    }

    const regex = new RegExp(this.formData.textToReplace, 'g');
    if (!regex.test(JSON.stringify(this.jsonData))) {
      console.error('Text to replace does not exist in the JSON data.');
      showToast("Text to replace does not exist in the JSON data.");
      return;
    }

    this.jsonData = JSON.parse(JSON.stringify(this.jsonData).replace(regex, this.formData.newText));
    showToast("Data saved successfully");
    console.log(this.jsonData);
    this.formData.textToReplace = '';
    this.formData.newText = '';
    },
    updateParameters() {
      if (!this.jsonData) {
        console.error('No JSON data available to modify and save.');
        showToast("No JSON data available to modify and save.");
        return;
      }
      this.parameterValues.forEach(parameter => {
        const parameterName = parameter.name;
        const parameterValue = parameter.value;
        this.jsonData.parameterContexts['UCG HC Shopify Reconciliation'].parameters.find(p => p.name === parameterName).value = parameterValue;
      });
      showToast("Data saved successfully");
    },
    exportJson() {
      if (!this.jsonData) {
        console.error('No JSON data available to export.');
        showToast("No JSON data available to export.");
        return;
      }
      const modifiedData = JSON.stringify(this.jsonData, null, 2);
      const blob = new Blob([modifiedData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modified_data.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
