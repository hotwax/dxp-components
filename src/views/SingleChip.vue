<template>
  <div @click="onSelected(isToggle)" class="chip" ref="parentRef">
    <ion-chip color="success">
      <ion-icon class="chip-icon" :icon="checkmark" ref="toggleIconRef" />
      <ion-label color="dark">Order here</ion-label>
    </ion-chip>
  </div>  
</template>


<script lang="ts">
import { createAnimation, IonChip, IonIcon, IonLabel } from "@ionic/vue";
import { ref, onMounted } from "vue";
import { checkmark } from 'ionicons/icons';

export default {
  name: "Home",

  components: {
    IonChip,
    IonIcon,
    IonLabel
  },

  setup() {
    const toggleIconRef = ref();
    const isToggle = ref(true);
    const parentRef = ref();

    let toggleAnimation: any;
    let removeAnimation: any;
    onMounted(() => {
      toggleAnimation = createAnimation()
        .addElement(toggleIconRef.value.$el)
        .afterRemoveClass("chip-icon")

      removeAnimation = createAnimation()
        .addElement(toggleIconRef.value.$el)
        .afterAddClass("chip-icon")
    });

    const onSelected = (selected: boolean) => {

      if(selected){
        console.log(parentRef.value.childNodes[0])
        const animate = createAnimation()
        .addElement(parentRef.value.childNodes[0])
        // .easing('ease-in-out')
        .duration(300)
        .fromTo('transform', 'scaleX(1)', 'scaleX(1.1)')
        // .keyframes([
        //     { offset: 0, transform: 'scaleX(1)' },
        //     { offset: 0.72, transform: 'scaleX(1.05)' },
        //     { offset: 1, transform: 'scaleX(1)' },
        //   ])
        .addAnimation([toggleAnimation]);  

        animate && animate.play();
      }
      else{
        console.log(selected)

        const animate = createAnimation()
        .addElement(parentRef.value.childNodes[0])
        // .easing('ease-out')
        .duration(300)
        .fromTo('transform', 'scaleX(1.1)', 'scaleX(1)')
        // .keyframes([
        //     { offset: 0, transform: 'scaleX(1)' },
        //     { offset: 0.72, transform: 'scaleX(1.05)' },
        //     { offset: 1, transform: 'scaleX(1)' },
        //   ])
        .addAnimation([removeAnimation]);  

        animate && animate.play();
      }
      isToggle.value = !selected;
    }

    return { onSelected, parentRef, toggleIconRef, checkmark, isToggle };
  },
};
</script>

<style scoped>
.chip {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.chip-icon{
  display: none;
}
</style>
