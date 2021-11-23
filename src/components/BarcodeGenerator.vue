<script>
//importing hyperscript from vue to create the HTML element
import { h } from "vue";
//importing jsbarcode method from jsbarcode library
var JsBarcode = require("jsbarcode");
export default {
  name: "BarcodeGenerator",
  // defining props and props type to be used in BarcodeGenerator component
  props: {
    value: [String, Number],
    format: [String],
    width: [String, Number],
    height: [String, Number],
    displayValue: {
      type: [String, Boolean],
      default: true,
    },
    text: [String, Number],
    fontOptions: [String],
    font: [String],
    textAlign: [String],
    textPosition: [String],
    textMargin: [String, Number],
    fontSize: [String, Number],
    background: [String],
    lineColor: [String],
    margin: [String, Number],
    marginTop: [String, Number],
    marginBottom: [String, Number],
    marginLeft: [String, Number],
    marginRight: [String, Number],
    flat: [Boolean],
    ean128: [String, Boolean],
    elementTag: {
      type: String,
      default: "svg",
      validator: function (value) {
        return ["canvas", "svg", "img"].indexOf(value) !== -1;
      },
    },
  },
//render function to create the HTML element 
  render() {
    return h(this.elementTag, { id: ["barcodegen"] });
  },
  // calling custom function (generateBarcode) inside mounted lifecycle method
  mounted: function () {
    generateBarcode.call(this);
  },
};
// custom function for taking props from the component and passing that to jsbarcode method and generating the barcode
function generateBarcode() {
  var that = this;
  var settings = {
    format: this.format,
    width: this.width,
    height: this.height,
    displayValue: this.displayValue,
    text: this.text,
    fontOptions: this.fontOptions,
    font: this.font,
    textAlign: this.textAlign,
    textPosition: this.textPosition,
    textMargin: this.textMargin,
    fontSize: this.fontSize,
    background: this.background,
    lineColor: this.lineColor,
    margin: this.margin,
    marginTop: this.marginTop,
    marginBottom: this.marginBottom,
    marginLeft: this.marginLeft,
    marginRight: this.marginRight,
    flat: this.flat,
    ean128: this.ean128,
    valid: function (valid) {
      that.valid = valid;
    },
    elementTag: this.elementTag,
  };
 
// custom function calling to remove the undefined objects from the settings
  removeUndefinedProps(settings);
// calling jsbarcode function and passing element, value and settings to generate the barcode
  JsBarcode(this.$el, this.value, settings);
}
//custom function to remove undefined objects from the settings
function removeUndefinedProps(obj) {
  Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});
}
</script>