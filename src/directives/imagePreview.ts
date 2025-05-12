import ImageModal from "../components/ImageModal.vue";
import { h, render } from "vue";

export default {
  mounted(el: HTMLElement, binding: any) {
    el.classList.add("pointer")

    const imageUrl = binding.value?.mainImageUrl;
    const productName = binding.value?.productName;

    const openModal = () => {
      const container = document.createElement("div")
      el.appendChild(container)

      const vnode = h(ImageModal, {
        imageUrl,
        productName,
        onClose: () => {
          render(null, container)         // Unmount component
          el.removeChild(container)       // Remove from DOM
        }
      })

      render(vnode, container)
    };

    el.addEventListener('click', openModal);
  }
};
