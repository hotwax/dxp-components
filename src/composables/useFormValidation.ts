import { useForm } from "vee-validate";
import * as yup from "yup";
import { buildYupSchema } from "./buildYupSchema";

export function useFormValidator(fields: any, initialValues?: any) {
  const schemaShape: Record<string, yup.AnySchema> = {}

  for (const key in fields) {
    const rules = fields[key]

    const schema = buildYupSchema(rules)
    schemaShape[key] = schema
  }

  const validationSchema = yup.object().shape(schemaShape)

  const { errors, validate, values } = useForm({
    validationSchema,
    initialValues
  }) as any

  const isFormValid = async () => {
    const result = await validate()
    return result.valid
  }

  return {
    validate,
    errors,
    values,
    isFormValid
  }
}
