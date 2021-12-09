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
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const pdfDocument = document.getElementById('PDF');
      const html = htmlToPdfmake(pdfDocument.innerHTML);  

      const docDefinition = {
        content: [html],
        defaultStyle: {
          fontSize: 15,
          bold: true,
          color: 'red'
        }
      };
      pdfMake.createPdf(docDefinition).open();
    }
  }  
}
</script>
