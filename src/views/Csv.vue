<template>
<div>
  <h1>json to csv</h1>
  <input type="textarea" rows="4" cols="50" v-model="json">
  <!-- You can also provide the following data in the input field in json form
  [
    {
        "Column 1": "1-1",
        "Column 2": "1-2",
        "Column 3": "1-3",
        "Column 4": "1-4"
    },
    {
        "Column 1": "2-1",
        "Column 2": "2-2",
        "Column 3": "2-3",
        "Column 4": "2-4"
    },
    {
        "Column 1": "3-1",
        "Column 2": "3-2",
        "Column 3": "3-3",
        "Column 4": "3-4"
    },
    {
        "Column 1": 4,
        "Column 2": 5,
        "Column 3": 6,
        "Column 4": 7
    }
  ] -->
  <button @click="convert">Convert</button>
</div>
</template>

<script>
import { jsonToCsv } from '@/utils'

export default {
  name: "Csv",
  data() {
    return {
      json: '' ,
      download: '',
      name: "download.csv",
      file: ''
    }
  },
  methods: {
    convert() {
      // Convert json into javascript object
      this.file = JSON.parse(this.json);
      jsonToCsv(this.file,{
        download:true,
        name: this.name
      })
    }
  },
}
</script>