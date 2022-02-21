import { ActionFunction, Link, LoaderFunction } from 'remix'
import { json, useLoaderData } from 'remix'
import { WhoaForm } from '~/components/WhoaForm'
import {
  authenticator,
  sessionStorage,
  supabaseStrategy,
} from '~/utils/auth/auth.server'

type LoaderData = {
  error: { message: string } | null
}

const loginInputs = [
  { inputType: 'text', name: 'email', labelTitle: 'Email' },
  { inputType: 'password', name: 'password', labelTitle: 'Password' },
]

export const action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate('sb', request, {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  await supabaseStrategy.checkSession(request, {
    successRedirect: '/profile',
  })

  const session = await sessionStorage.getSession(request.headers.get('Cookie'))

  const error = session.get(
    authenticator.sessionErrorKey
  ) as LoaderData['error']

  return json<LoaderData>({ error })
}

export default function Screen() {
  const { error } = useLoaderData<LoaderData>()

  return (
    <>
      <WhoaForm
        formTitle="Login"
        inputConfigs={loginInputs}
        submitTitle="Login With Supabase"
      />

      <div className="flex-center">
        <Link to="/auth/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </>
  )
}
