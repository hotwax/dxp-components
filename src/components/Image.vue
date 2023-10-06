<template>
  <img :src="imageUrl"/>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue';
import { imageContext as context } from "../index";
import { useUserStore } from '../store/user'

const userStore = useUserStore();

const props = defineProps(['src']);
let imageUrl = ref(context.defaultImgUrl);
const resourceUrl = computed(() => userStore.getAppResourceUrl).value || "";

const setImageUrl = () => {
  if (props.src) {
    if (props.src.indexOf('assets/') != -1) {
      // Assign directly in case of assets
      imageUrl.value = props.src;
    } else if (props.src.startsWith('http')) {
      // If starts with http, it is web url check for existence and assign
      checkIfImageExists(props.src).then(() => {
        imageUrl.value = props.src;
      }).catch(() => {
        console.error("Image doesn't exist");
      })
    } else {
      // Image is from resource server, hence append to base resource url, check for existence and assign
      const newImageUrl = resourceUrl.concat(props.src)
      checkIfImageExists(imageUrl).then(() => {
        imageUrl.value = newImageUrl;
      }).catch(() => {
        console.error("Image doesn't exist");
      })
    }
  }
}

const checkIfImageExists = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(false);
    img.src = src;
  })
}

onMounted(() => {
  setImageUrl();
})

onUpdated(() => {
  setImageUrl();
});
</script>