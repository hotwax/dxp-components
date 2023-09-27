<template>
  <!-- default values - placeholder - 'Search', showClearButton - 'always' -->
  <ion-searchbar 
    :placeholder='placeholder'
    :showClearButton="showClearButton"
    @keyup.enter="search($event.target.value)"
    @ionClear="emit('on-clear')"
    @ionFocus="emit('on-focus', $event)"
  />
</template>

<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';

defineProps(['placeholder', 'showClearButton'])
// ionClear event is used in the Job Manager app on the Pipeline page hence the on-clear emit
const emit = defineEmits(['update-query-string', 'on-search', 'on-clear', 'on-focus'])

function search(queryString: string) {
  emit('update-query-string', queryString)
  emit('on-search')
}
</script>