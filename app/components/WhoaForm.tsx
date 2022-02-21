import { FC } from 'react'
import { Form, useActionData, useTransition } from 'remix'
import { FormConfig } from '~/utils/formConfigs'

export interface IWhoaForm<ValidNameKeys> {
  formTitle: string
  formSubtitle?: string
  inputConfigs: FormConfig<ValidNameKeys>[]
  submitTitle?: string
  actionPath?: string
  isLoading?: boolean
  clientSubmit?: (event: React.FormEvent) => any
  data?: any
  className?: string
  reloadDocument?: boolean
}

export const getDefaultFormValues = (
  formFields: FormConfig<string>[],
  data: any
) => {
  const defaultValues: any = {}

  formFields.map(field => {
    if (
      field.name === 'tags' &&
      data &&
      data[field.name] &&
      Array.isArray(data[field.name])
    ) {
      const stringValue = data[field.name].join(', ')

      defaultValues[field.name] = stringValue
    } else if (data && data[field.name]) {
      defaultValues[field.name] = data[field.name]
    }
  })

  return defaultValues
}

const Select: FC<{ config: FormConfig<any> }> = ({ config }) => {
  return (
    <div className="flex flex-col">
      <label className="label text-xl" htmlFor={config.name}>
        {config.labelTitle}
      </label>

      <select className="select select-bordered" name={config.name}>
        {config?.select?.options.map(option => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

const Input: FC<{
  config: FormConfig<any>
  defaultValues: any
  fieldError: null | { message: string; fieldName: string }
}> = ({ config, defaultValues, fieldError }) => {
  return (
    <>
      <div className="flex flex-col">
        <label className="label text-xl" htmlFor={config.name}>
          {config.labelTitle}{' '}
          {fieldError?.message && (
            <span className="text-error">{fieldError.message}</span>
          )}
        </label>

        {config.labelSubtitle && (
          <label className="label text-sm">{config.labelSubtitle}</label>
        )}

        <input
          className={`input outlined ${fieldError ? 'input-error' : ''}`}
          name={config.name}
          type={config.inputType}
          defaultValue={defaultValues[config.name]}
          placeholder={config.labelTitle}
          inputMode={config.inputMode}
          list={config.listValues ? config.name : undefined}
          disabled={config.disabled}
        />
      </div>
      <datalist id={config.name}>
        {config.listValues &&
          config.listValues.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
      </datalist>
    </>
  )
}

const Checkbox: FC<{ config: FormConfig<any>; defaultValues: any }> = ({
  config,
  defaultValues,
}) => {
  return (
    <>
      <div className="flex justify-between items-center w-1/4">
        <label className="cursor-pointer label text-xl" htmlFor={config.name}>
          <span className="label-text">{config.labelTitle}</span>
        </label>
        <input
          className="checkbox checkbox-primary"
          name={config.name}
          type={config.inputType}
          defaultChecked={defaultValues[config.name]}
          value="true"
        />
      </div>
    </>
  )
}

// TODO choose weather to map default values to form fields from db data or url params
// TODO wire in action data to display error messages
// TODO add more form features that are in notes
export const WhoaForm: FC<IWhoaForm<any>> = ({
  formTitle,
  formSubtitle,
  inputConfigs,
  submitTitle = 'Submit',
  actionPath,
  clientSubmit,
  isLoading,
  data,
  className,
  children,
  reloadDocument,
  // transition,
}) => {
  const transition = useTransition()
  const action = useActionData()
  // if you pass in data, it will read the data and set the default values
  const defaultValues = getDefaultFormValues(inputConfigs, data)

  const handleClientSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (clientSubmit) {
      event.preventDefault()
      clientSubmit(event)
    }
  }

  const errorFields = action?.errorFields

  const disableSubmit = action?.result?.message === 'successful'

  // const groups: Record<string, InputConfig<any>[]> = {}

  // inputConfigs.forEach(config => {
  //   const currGroup = config?.group

  //   // if group doesn't exist in groups, create array and push otherwise push
  //   if (currGroup && !groups[currGroup]) {
  //     groups[currGroup] = [config]
  //   } else if(currGroup && groups[currGroup]) {
  //     groups[currGroup].push(config)
  //   }
  // })

  return (
    <div className={`app-card bg-base-200 p-4 ${className ? className : ''}`}>
      <div className="flex-center">
        <h1 className="text-2xl">{formTitle}</h1>
      </div>
      <div className="flex-center">
        <h4 className="text-sm">{formSubtitle}</h4>
      </div>
      {action?.error?.message && (
        <div className="bg-error rounded-md p-2">{action.error?.message}</div>
      )}

      {action?.info && (
        <div className="bg-info rounded-md p-2">{action.info?.message}</div>
      )}
      <Form
        method="post"
        action={actionPath}
        onSubmit={handleClientSubmit}
        reloadDocument={reloadDocument}
      >
        {inputConfigs.map(config => {
          if (config.inputType === 'other') {
            return (
              <div className="flex-center">
                <h1 className="text-2xl my-4">{config.labelTitle}</h1>
              </div>
            )
          }
          if (config.select) {
            return <Select config={config} />
          }

          if (config.inputType === 'checkbox') {
            return <Checkbox config={config} defaultValues={defaultValues} />
          }

          return (
            <Input
              config={config}
              defaultValues={defaultValues}
              fieldError={errorFields ? errorFields[config.name] : null}
            />
          )
        })}

        <div className="flex justify-center w-full">
          <button
            className="w-full btn btn-primary mt-4 md:w-1/4"
            disabled={isLoading || disableSubmit}
            type="submit"
          >
            {transition.state === 'loading' || transition.state === 'submitting'
              ? 'Loading...'
              : submitTitle}
          </button>
        </div>
      </Form>
      {children}
    </div>
  )
}
