import { FormConfig } from '~/utils/formConfigs'

type FieldMods = Record<string, Function>

export const parseFromFormFields = async <FormKeys extends string>(
  formFields: FormConfig<any>[],
  request: Request,
  fieldModifications?: FieldMods
) => {
  let body = await request.formData()
  const data: Record<any, any> = {}

  formFields.forEach(field => {
    let value: any = ''
    if (field.inputType === 'number') {
      value = Number(body.get(field.name) as string)
      // if it's a number 0 would result in falsey condition
      if (value !== undefined || value !== null) {
        data[field.name] = value
      }
    } else if (field.inputType === 'text' || field.inputType === 'password') {
      value = body.get(field.name) as string
      if (value) {
        data[field.name] = value
      }
    } else if (
      field.inputType === 'datetime-local' ||
      field.inputType === 'date'
    ) {
      value = body.get(field.name) as string
      if (value) {
        data[field.name] = new Date(value)
      }
    }

    if (fieldModifications && value && fieldModifications[field.name]) {
      const fieldModFunction = fieldModifications[field.name]

      data[field.name] = fieldModFunction(value)
    }
  })

  return data as Record<FormKeys, any>
}

export const processTags = (tagsString: string) => {
  // split string by commas and remove white space from front and back
  return tagsString.split(',').map(tag => {
    return tag.trim()
  })
}
