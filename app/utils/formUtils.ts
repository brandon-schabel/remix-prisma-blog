import { FormConfig, SelectType } from './formConfigs'

// add field mod to input configs
// for example a tags input would just be a text field with the field mod set to processTags
export const textInput = (
  title: string,
  name: string,
  additionalOptions?: FormConfig<any>
): FormConfig<any> => {
  return {
    ...additionalOptions,
    labelTitle: title,
    name,
    inputType: 'text',
  }
}
export const numberInput = (
  title: string,
  name: string,
  additionalOptions?: FormConfig<any>
): FormConfig<any> => {
  return {
    ...additionalOptions,
    labelTitle: title,
    name,
    inputType: 'number',
  }
}
export const checkboxInput = (
  title: string,
  name: string,
  additionalOptions?: FormConfig<any>
): FormConfig<any> => {
  return {
    ...additionalOptions,
    labelTitle: title,
    name,
    inputType: 'checkbox',
  }
}
export const listInput = (
  title: string,
  name: string,
  listValues: string[],
  additionalOptions?: FormConfig<any>
): FormConfig<any> => {
  return {
    ...additionalOptions,
    labelTitle: title,
    name,
    inputType: 'text',
    listValues: listValues,
  }
}

export const selectInput = (
  title: string,
  name: string,
  selectOptions: SelectType[],
  additionalOptions?: FormConfig<any>
): FormConfig<any> => {
  return {
    ...additionalOptions,
    labelTitle: title,
    name,
    inputType: 'select',
    select: { options: selectOptions },
  }
}

export const fileInput = (
  title: string,
  name: string,
  accept?: string | null,
  multiple: boolean = true,
  additionalOptions?: FormConfig<any>
) => {
  return {
    ...additionalOptions,
    inputType: 'file',
    name,
    labelTitle: title,
    accept: accept ? accept : 'image/*',
    multiple: multiple,
  }
}

export const hiddenInput = (name: string, value: string): FormConfig<any> => {
  return {
    name,
    inputType: 'text',
    hidden: true,
    labelTitle: '',
    value,
  }
}
