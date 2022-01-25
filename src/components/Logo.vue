<template>
  <figure>
    <img class="light" src="../assets/images/hc.png"/>
    <img class="dark" src="../assets/images/HWCLogoDarkMode.png"/>
  </figure>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Logo",
})
</script>

<style scoped>
.dark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .dark {
    display: unset;
  }
  
  .light {
    display: none;
  }
}
</style>