import { useField } from "vee-validate";
import { buildYupSchema } from "./buildYupSchema";

export function useFieldValidator(fieldName: string, rules: any, initialValue?: any) {
  const schema = buildYupSchema(rules)

  const { value, errorMessage, validate } = useField(fieldName, schema, {
    initialValue
  })

  const isFieldValid = async () => {
    const result = await validate();
    return result?.valid
  }

  return {
    value,
    errorMessage,
    validate,
    isFieldValid
  }
}
