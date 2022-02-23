import { ActionFunction, json, redirect, useActionData } from 'remix'
import { WhoaForm } from '~/components/WhoaForm'
import { parseFormFields } from '~/utils/parseForm'
import { supabaseClient } from '~/utils/supabase'

const signUpInputs = [
  { inputType: 'text', name: 'email', labelTitle: 'Email' },
  { inputType: 'password', name: 'password', labelTitle: 'Password' },
]

type FormFields = 'email' | 'password'
export const action: ActionFunction = async ({ request }) => {
  const parseData = await parseFormFields<FormFields>(
    signUpInputs,
    await request.formData()
  )
  if (!parseData) return null

  const { email = '', password = '' } = parseData

  const result = await supabaseClient.auth.signUp({ email, password })
  if (result.error) {
    return json(
      { error: { message: result.error.message } },
      result.error.status
    )
  }

  return redirect('/')
}

export default () => {
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
