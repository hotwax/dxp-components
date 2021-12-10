<template>
  <div @click="onSelected(isToggle)" class="chip">
    <ion-chip color="success" outline="true">
      <ion-icon class="chip-icon" :icon="checkmark" ref="toggleIconRef" />
      <ion-label color="dark">Order here</ion-label>
    </ion-chip>
  </div>  
</template>


<script lang="ts">
import { createAnimation, IonChip, IonIcon } from "@ionic/vue";
import { ref, onMounted } from "vue";
import { checkmark } from 'ionicons/icons';

export default {
  name: "Home",

  components: {
    IonChip,
    IonIcon
  },

  setup() {
    const toggleIconRef = ref();
    const isToggle = ref(true);

    let toggleAnimation: any;
    let removeAnimation: any;
    onMounted(() => {
      toggleAnimation = createAnimation()
        .addElement(toggleIconRef.value.$el)
        .duration(500)
        .easing('ease-in')
        .afterRemoveClass("chip-icon")
        .keyframes([
          { offset: 0, transform: "scale(1)" },
          { offset: 0.5, transform: "scale(1.1)" },
          { offset: 1, transform: "scale(1)" },
        ]);

      removeAnimation = createAnimation()
        .addElement(toggleIconRef.value.$el)
        .duration(500)
        .easing('ease-in')
        .afterAddClass("chip-icon")
        .keyframes([
          { offset: 0, transform: "scale(1)" },
          { offset: 0.5, transform: "scale(1.1)" },
          { offset: 1, transform: "scale(1)" },
        ]);
    });

    const onSelected = (selected: boolean) => {
      if(selected){
        console.log(selected)
        toggleAnimation && toggleAnimation.play();
        isToggle.value = !selected;
      }
      else{
        isToggle.value = !selected;
        console.log(selected)
        removeAnimation && removeAnimation.play();
      }
    }

    return { onSelected, toggleIconRef, checkmark, isToggle };
  },
};
</script>

<style scoped>
.square {
  width: 100px;
  height: 100px;
  margin: 100px;
  background-color: black;
}
.chip {
  margin: 100px 0px 0px 500px;
}
.chip-icon{
  display: none;
}
</style>
