<template>
  <IonLabel v-on:click="sampleCalled">{{ test }}</IonLabel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonLabel } from '@ionic/vue';

let test = ref('sample')

function sampleCalled() {
  test.value = 'called'
}
</script>