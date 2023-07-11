import { defineComponent } from "vue"
import { defaultImgUrl } from "../index";

export default defineComponent({
  template: `
            <img :src="imageUrl"/>
            `,
  data() {
    return {
      imageUrl: defaultImgUrl
    }
  },
  props: ['src', 'size'],
  mounted() {
    this.setImageUrl();
  },
  updated() {
    this.setImageUrl();
  },
  methods: {
    prepareImgUrl(src: string, size?: string) {
      // return original size if no size is given
      if (!size) return src
      // remove any current image size then add the new image size
      return src
      .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
      .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
        return '_' + size + match;
      })
    },
    checkIfImageExists(src: string) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
          resolve(true);
        }
        img.onerror = function () {
          reject(false);
        }
        img.src = src;
      })
    },
    setImageUrl() {
      if (this.src) {
        const src: string = this.prepareImgUrl(this.src, this.size)
        if (src.indexOf('assets/') != -1) {
          // Assign directly in case of assets
          this.imageUrl = src;
        } else if (src.startsWith('http')) {
          // If starts with http, it is web url check for existence and assign
          this.checkIfImageExists(src).then(() => {
            this.imageUrl = src;
          })
        }
      }
    }
  }
})