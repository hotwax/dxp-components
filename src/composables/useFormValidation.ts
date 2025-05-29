import { useForm } from 'vee-validate'
import * as yup from 'yup'

export function useFormValidator(fields: any, initialValues?: any) {
  const schemaShape: Record<string, yup.AnySchema> = {}

  for (const key in fields) {
    const rules = fields[key]
    let schema: yup.AnySchema = yup.mixed()

    // Determine base type
    const isString = rules.some((rule: any) => rule === 'email' || rule === 'minLength' || rule === 'maxLength' || rule === 'mobile')
    const isNumber = rules.some((rule: any) => rule === 'number' || typeof rule === 'object' && (rule.type === 'min' || rule.type === 'max'))

    if (isString) schema = yup.string()
    else if (isNumber) schema = yup.number().typeError('Must be a number')

    for (const rule of rules) {
      if (rule === 'required') {
        schema = schema.required('This field is required')
      } else if (rule === 'email') {
        schema = (schema as yup.StringSchema).email('Invalid email')
      } else if (rule === 'mobile') {
        schema = (schema as yup.StringSchema).matches(
          /^(\+?\d{10,15})$/,
          'Invalid mobile number'
        )
      }
       else if (typeof rule === 'object') {
        if (rule.type === 'min') {
          schema = (schema as yup.NumberSchema).min(rule.value, `Minimum value is ${rule.value}`)
        } else if (rule.type === 'max') {
          schema = (schema as yup.NumberSchema).max(rule.value, `Maximum value is ${rule.value}`)
        } else if (rule.type === 'minLength') {
          schema = (schema as yup.StringSchema).min(rule.value, `Minimum length is ${rule.value}`)
        } else if (rule.type === 'maxLength') {
          schema = (schema as yup.StringSchema).max(rule.value, `Maximum length is ${rule.value}`)
        }
      } else if (rule === 'none') {
        schema = yup.mixed()
      }
    }

    schemaShape[key] = schema
  }

  const validationSchema = yup.object().shape(schemaShape)

  const { errors, validate, values } = useForm({
    validationSchema,
    initialValues
  }) as any

  const isFormValid = async () => {
    const result = await validate()
    console.log(result);
    
    return result.valid
  }

  return {
    validate,
    errors,
    values,
    isFormValid
  }
}
