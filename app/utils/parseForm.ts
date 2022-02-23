import { FormConfig } from '~/utils/formConfigs'

type FieldMods = Record<string, Function>

const textFields = ['text', 'email', 'password']

export const parseFormFields = async <FormFieldList extends string>(
  formFields: FormConfig<any>[],
  formData: FormData,
  fieldModifications?: FieldMods
) => {
  try {
    let body = formData
    console.log(body)
    const data: Record<any, any> = {}

    formFields.forEach(field => {
      if (!field.inputType) return null
      let value: any = body.get(field.name)

      if (field.inputType === 'number') {
        value = Number(value)
        // if it's a number 0 would result in falsey condition
        if (value !== undefined || value !== null) {
          data[field.name] = value
        }
      } else if (textFields.includes(field.inputType)) {
        if (value) {
          data[field.name] = value
        }
      } else if (
        field.inputType === 'datetime-local' ||
        field.inputType === 'date'
      ) {
        if (value) {
          data[field.name] = new Date(value)
        }
      } else if (field.inputType === 'checkbox') {
        if (field.checkbox?.value) {
          // if custom value is set for checkbox, then use that
          data[field.name] = field.checkbox.value
        } else {
          // otherwise, it will be true or false
          data[field.name] = value === 'true'
        }
      }

      if (fieldModifications && value && fieldModifications[field.name]) {
        const fieldModFunction = fieldModifications[field.name]

        data[field.name] = fieldModFunction(value)
      }
    })

    return data as Record<FormFieldList, any>
  } catch (err) {
    console.error(err)
    // throw err
  }
}

export const processTags = (tagsString: string) => {
  // split string by commas and remove white space from front and back
  return tagsString.split(',').map(tag => {
    return tag.trim()
  })
}
