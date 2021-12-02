<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" accept=".csv" id="file" ref="file" v-on:change="handleFileUpload($event)"/>
      </label>
        <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>


  <table v-if="parsed" style="width: 100%;">
    <thead>
        <tr>
            <th v-for="(header, key) in content.meta.fields"
                v-bind:key="'header-'+key">
                {{ header }}
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(row, rowKey) in content.data"
            v-bind:key="'row-'+rowKey">
                <td v-for="(column, columnKey) in content.meta.fields"
                    v-bind:key="'row-'+rowKey+'-column-'+columnKey">
                        <input v-model="content.data[rowKey][column]"/>
                </td>
        </tr>
    </tbody>
</table>
</template>


<script>

// import Papa, { parse } from 'papaparse';
// import axios from 'axios';
import { parseCsv } from '@/utils'

export default {
    name: "CsvParse",
    data(){
    return {
        file: '',
        content: [],
        parsed: false
    }
},
methods: {
    handleFileUpload(event){
        this.file = event.target.files[0];
        this.parseFile();
    },
    parseFile(){
    // Papa.parse( this.file, {
    //     header: true,
    //     skipEmptyLines: true,
    //     complete: function( results ){
    //         this.content = results;
    //         this.parsed = true;
    //     }.bind(this)
    
    // } );
    console.log("parseFile started")
    const abc = parseCsv(this.file)
    abc.then(res => {
        this.content = res
        console.log(res)
        // this.parsed=true
    })
},
}
}
</script>