import { defineComponent, ref, h } from "vue"

export default defineComponent({
  setup: function () {
    const test = ref('value')

    function sampleCalled() {
      test.value = 'changed'
      console.log('inside sample called method', test)
    }

    const render = () => {
      return `<div @click="sampleCalled()">{{ test }}</div>`
    }

    return (h: any) => render()
  }
})
