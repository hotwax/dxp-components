<template>
  <img :src="imageUrl" v-if="imageUrl" />
  <ion-skeleton-text v-else animated />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonSkeletonText } from '@ionic/vue'

export default defineComponent({
  name: "Image",
  props: ['src'],
  components: {
    IonSkeletonText
  },
  created() {
    if (
      process.env.VUE_APP_RESOURCE_URL
    ) {
      this.resourceUrl = process.env.VUE_APP_RESOURCE_URL;
    }
  },
  mounted() {
    this.setImageUrl();
  },
  updated() {
    this.setImageUrl();
  },
  data() {
    return {
      resourceUrl: '',
      imageUrl: ''
    }
  },
  methods: {
    checkIfImageExists(src: string) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
          resolve(true);
        }
        img.onerror = function (error) {
          reject(false);
        }
        img.src = src;
      })
    },
    setImageUrl() {
      // TODO Refactor with guard pattern
      if (this.src) {
        if (this.src.indexOf('assets/') != -1) {
          // Assign directly in case of assets
          this.imageUrl = this.src;
        } else if (this.src.startsWith('http')) {
          // If starts with http, it is web url check for existence and assign
          this.checkIfImageExists(this.src).then(() => {
            this.imageUrl = this.src;
          }).catch(() => {
            this.imageUrl = require("@/assets/images/defaultImage.png") ;
            this.$log.warn("Image doesn't exist", this.src);
          })
        } else {
          // Image is from resource server, hence append to base resource url, check for existence and assign
          const imageUrl = this.resourceUrl.concat(this.src)
          this.checkIfImageExists(imageUrl).then(() => {
            this.imageUrl = imageUrl;
          }).catch(() => {
            this.$log.warn("Image doesn't exist", imageUrl);
          })
        }
      }
    }
  },
});
</script>
