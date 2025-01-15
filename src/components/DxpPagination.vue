<template>
  <ion-button size="small" fill="clear" color="medium" @click="goToFirstPage" :disabled="currentPage === 1">
    <ion-icon slot="icon-only" :icon="playSkipBackOutline" />
  </ion-button>
  <ion-button size="small" fill="clear" color="medium" @click="goToPreviousPage" :disabled="currentPage === 1">
    <ion-icon slot="icon-only" :icon="chevronBackOutline" />
  </ion-button>

  <ion-button
    v-for="pageCount in getDisplayedPageCounts()"
    :key="pageCount" size="small" fill="clear"
    :color="currentPage === pageCount ? 'dark' : 'medium'"
    :class="{ 'selected-page': currentPage === pageCount }"
    @click="updateCurrentPage(pageCount)"
  >
    {{ pageCount }}
  </ion-button>

  <ion-button size="small" fill="clear" color="medium" @click="goToNextPage" :disabled="currentPage === totalPages">
    <ion-icon slot="icon-only" :icon="chevronForwardOutline" />
  </ion-button>
  <ion-button size="small" fill="clear" color="medium" @click="goToLastPage" :disabled="currentPage === totalPages">
    <ion-icon slot="icon-only" :icon="playSkipForwardOutline" />
  </ion-button>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { playSkipBackOutline, chevronBackOutline, chevronForwardOutline, playSkipForwardOutline } from 'ionicons/icons';

const props = defineProps({
  itemsPerPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['updatePageCount']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const currentPage = ref(1);

// Function to determine which page numbers to display based on the current page
function getDisplayedPageCounts() {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - 1);
  const endPage = Math.min(totalPages.value, startPage + 2);
  
  for(let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

// Changes the current page to the specified page and emits an event to notify the parent component to fetch new items.
function updateCurrentPage(pageCount: number) {
  if(pageCount < 1 || pageCount > totalPages.value) {
    return;
  }
  currentPage.value = pageCount;
  const viewIndex = (currentPage.value - 1);
  emit('updatePageCount', viewIndex);
}

function goToFirstPage() {
  updateCurrentPage(1);
}

function goToPreviousPage() {
  updateCurrentPage(currentPage.value - 1);
}

function goToNextPage() {
  updateCurrentPage(currentPage.value + 1);
}

function goToLastPage() {
  updateCurrentPage(totalPages.value);
}
</script>

<style scoped>
.selected-page {
  font-size: 15px;
}
</style>