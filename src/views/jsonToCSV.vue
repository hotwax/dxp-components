<template>
<div>
  <h1>json to csv</h1>
  <input type="textarea" rows="4" cols="50" v-model="json">
  <button v-on:click="convert">Convert</button>
</div>
</template>

<script>
import Papa from 'papaparse'
import { saveAs } from "file-saver";

export default {
  name: "csv",
  data() {
    return {
      json: '' ,
      download: '',
      name: "download.csv"
    }
  },
  methods: {
    convert() {
      console.log(this.json)
      const file = JSON.parse(this.json)
      console.log(file)
      // Papa.unparse(file,{
      //   header: true,
      //   skipEmptyLines: true,
      //   complete: function(results) {
      //     this.download = results
      //     console.log(results)
      //   }
      // })
      const csv = Papa.unparse(file,{
        // header: false
      })
      console.log(csv)
      const encoding = {
        type: String,
      default: "utf-8"
      }
      const blob = new Blob([csv], {
          type: "application/csvcharset=" + this.encoding
      });
        saveAs(blob,this.name );
    }
  },
  // setup() {
    
  // },
}
</script>