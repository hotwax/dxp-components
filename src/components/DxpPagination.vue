<template>
  <ion-button size="small" fill="clear" color="medium" @click="changePage(1)" :disabled="currentPage === 1">
    <ion-icon slot="icon-only" :icon="playSkipBackOutline" />
  </ion-button>
  <ion-button size="small" fill="clear" color="medium" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
    <ion-icon slot="icon-only" :icon="chevronBackOutline" />
  </ion-button>

  <ion-button
    v-for="pageIndex in getDisplayedPageCounts()"
    :key="pageIndex"
    fill="clear"
    :size="currentPage === pageIndex ? 'default' : 'small'"
    :color="currentPage === pageIndex ? 'dark' : 'medium'"
    @click="updateCurrentPage(pageIndex)"
  >
    {{ pageIndex }}
  </ion-button>

  <ion-button size="small" fill="clear" color="medium" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
    <ion-icon slot="icon-only" :icon="chevronForwardOutline" />
  </ion-button>
  <ion-button size="small" fill="clear" color="medium" @click="changePage(totalPages)" :disabled="currentPage === totalPages">
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
  const endPage = Math.min(totalPages.value, currentPage.value + 1);
  for(let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

// Changes the current page to the specified page and emits an event to notify the parent component to fetch new items.
function updateCurrentPage(pageIndex: number) {
  currentPage.value = pageIndex;
  const viewIndex = (currentPage.value - 1);
  emit('updatePageCount', viewIndex);
}

function changePage(pageIndex: number) {
  updateCurrentPage(pageIndex);
}
</script>