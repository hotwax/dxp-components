<template>
  <div id="PDF">
    <ul>
      <li>xyz</li>
      <li>xyz</li>
      <li>xyz</li>
      <li>xyz</li>
    </ul>
  </div>
  <ion-button @click="generatePdf()">Generate PDF</ion-button>
</template>
<script>
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
 
export default {
  methods: {
    generatePdf() {
      //get table html
      const pdfDocument = document.getElementById('PDF');
      //html to pdf format
      const html = htmlToPdfmake(pdfDocument.innerHTML);  
      const documentDefinition = { content: html };
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      pdfMake.createPdf(documentDefinition).open();  
    }
  }  
}

</script>