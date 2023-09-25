<template>
  <ion-searchbar 
    :placeholder='props.placeholder'
    :showClearButton="props.showClearButton ? props.showClearButton : 'focus'"
    @keyup.enter="search($event.target.value)"
    @ionClear="emit('on-clear')"
    @ionFocus="emit('on-focus', $event)"
  />
</template>

<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['placeholder', 'showClearButton'])
// ionClear event is used in the Job Manager app on the Pipeline page hence the on-clear emit
const emit = defineEmits(['update-query-string', 'on-search', 'on-clear', 'on-focus'])

function search(queryString: string) {
  emit('update-query-string', queryString)
  emit('on-search')
}
</script>