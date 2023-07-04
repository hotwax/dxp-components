import { defineComponent } from "vue"
import { resourceUrl, defaultImgUrl } from "../index";

export default defineComponent({
  template: `
            <img :src="imageUrl"/>
            `,
  data() {
    return {
      imageUrl: ''
    }
  },
  props: ['src', 'size'],
  async mounted() {
    this.setImageUrl();
  },
  updated() {
    this.setImageUrl();
  },
  methods: {
    addSizeInImgUrl(src: string, size: string) {
      if (src) {
        // return original size if no size is given
        if (!size) return src
        return src
        // remove any current image size then add the new image size
        .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
          return '_' + size + match;
        })
      }
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
      const src = this.addSizeInImgUrl(this.src, this.size)
      if (src) {
        if (src.indexOf('assets/') != -1) {
          // Assign directly in case of assets
          this.imageUrl = src;
        } else if (src.startsWith('http')) {
          // If starts with http, it is web url check for existence and assign
          this.checkIfImageExists(src).then(() => {
            this.imageUrl = src;
          }).catch(() => {
            this.imageUrl = defaultImgUrl
          })
        } else {
          // Image is from resource server, hence append to base resource url, check for existence and assign
          const imageUrl = resourceUrl.concat(src)
          this.checkIfImageExists(imageUrl).then(() => {
            this.imageUrl = imageUrl;
          }).catch(() => {
            this.imageUrl = defaultImgUrl
          })
        } 
      } else {
        this.imageUrl = defaultImgUrl
      }
    }
  }
})