<template>
  <PdfTemplate v-show="false" />
  <button @click="generatePdf">PDF</button>
</template>
<script>
import PdfTemplate from "@/views/PdfTemplate.vue"
export default {
  components: {
    PdfTemplate
  },
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
        }
      }
      pdfMake.createPdf(docDefinition).open();
    }
  },
} 
</script>