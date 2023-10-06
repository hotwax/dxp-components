<template>
  <img :src="imageUrl" />
</template>
  
<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue";
import { shopifyImgContext as context } from "../index";

console.log("sd");

const props = defineProps(['src', 'size']);
const imageUrl = ref(context.defaultImgUrl);

const checkIfImageExists = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(false);
    img.src = src;
  })
};

const prepareImgUrl = (src: string, size?: string) => {
  // return original size if no size is given
  if (!size) return src

  // remove any current image size then add the new image size
  return src
    .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
      return '_' + size + match;
    })
};

const setImageUrl = () => {
  if (props.src) {
    const src: string = prepareImgUrl(props.src, props.size)
    checkIfImageExists(src).then(() => imageUrl.value = src)
  }
};

onMounted(() => {
  setImageUrl();
});

onUpdated(() => {
  setImageUrl();
});
</script>