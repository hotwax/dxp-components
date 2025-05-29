import * as yup from "yup";

export function buildYupSchema(rules: any): yup.AnySchema {
  let schema: yup.AnySchema = yup.mixed()
  let isString = false
  let isNumber = false
  let isRequired = false

  for (const rule of rules) {
    if (rule === "email") {
      isString = true
      schema = yup.string().email("Invalid email format")
    } else if (rule === "number") {
      isNumber = true
      schema = yup.number().typeError("Must be a number")
    } else if (rule === "mobile") {
      isString = true
      schema = yup.string().matches(/^\+?[0-9]{10,15}$/, "Invalid mobile number")
    } else if (typeof rule === "object") {
      if (rule.type === "min") {
        schema = (schema as yup.NumberSchema).min(rule.value, `Minimum value is ${rule.value}`)
      } else if (rule.type === "max") {
        schema = (schema as yup.NumberSchema).max(rule.value, `Maximum value is ${rule.value}`)
      } else if (rule.type === "minLength") {
        isString = true
        schema = (schema as yup.StringSchema).min(rule.value, `Minimum length is ${rule.value}`)
      } else if (rule.type === "maxLength") {
        isString = true
        schema = (schema as yup.StringSchema).max(rule.value, `Maximum length is ${rule.value}`)
      }
    } else if (rule === "required") {
      isRequired = true
    }
  }

  // Set base type if no type has been assigned yet
  if (!isString && !isNumber) {
    schema = yup.mixed()
  }

  // Apply required at the end to avoid being overridden
  if (isRequired) {
    schema = schema.required("This field is required")
  }

  return schema
}