import { ActionFunction, json, redirect, useActionData } from 'remix'
import { WhoaForm } from '~/components/WhoaForm'
import { parseFromFormFields } from '~/utils/parseForm'
import { supabaseClient } from '~/utils/supabase'

const signUpInputs = [
  { inputType: 'text', name: 'email', labelTitle: 'Email' },
  { inputType: 'password', name: 'password', labelTitle: 'Password' },
]

type FormFields = 'email' | 'password'
export const action: ActionFunction = async ({ request }) => {
  const parseData = await parseFromFormFields<FormFields>(signUpInputs, request)
  if (!parseData) return null

  const { email = '', password = '' } = parseData
  console.log(email, password)

  const result = await supabaseClient.auth.signUp({ email, password })
  if (result.error) {
    return json(
      { error: { message: result.error.message } },
      result.error.status
    )
  }

  console.log(result)

  return redirect('/')
}

export default () => {
  const action = useActionData<any>()
  console.log(action)
  return (
    <WhoaForm
      formTitle="Sign Up"
      inputConfigs={[
        { inputType: 'text', name: 'email', labelTitle: 'Email' },
        { inputType: 'password', name: 'password', labelTitle: 'Password' },
      ]}
      submitTitle="Sign Up"
    />
  )
}
