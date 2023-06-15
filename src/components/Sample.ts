import { defineComponent, ref } from "vue"

export default defineComponent({
  template: `<div @click="sampleCalled()">{{ test }}</div>`,
  setup: function () {
    const test = ref('value')

    function sampleCalled() {
      test.value = 'changed'
      console.log('inside sample called method', test)
    }

    return {  
      sampleCalled,
      test
    }
  }
})
