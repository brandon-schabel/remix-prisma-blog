import type { ActionFunction, LoaderFunction } from 'remix'
import { Form, json, useLoaderData } from 'remix'
import {
  authenticator,
  sessionStorage,
  supabaseStrategy,
} from '~/utils/auth/auth.server'

type LoaderData = {
  error: { message: string } | null
}

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
    <Form method="post">
      {error && <div>{error.message}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>

      <button>Log In</button>
    </Form>
  )
}

// import { ActionFunction, Link, redirect } from 'remix'
// import { WhoaForm } from '~/components/WhoaForm'
// import { supabaseStrategy, sessionStorage } from '~/utils/auth/auth.server'

// const loginInputs = [
//   { inputType: 'text', name: 'email', labelTitle: 'Email' },
//   { inputType: 'password', name: 'password', labelTitle: 'Password' },
// ]

// export const action: ActionFunction = async ({ request }) => {
//   // const formData = await parseFromFormFields(loginInputs, request)
//   // const email = formData.email
//   // const password = formData.password
//   // const result = await supabaseClient.auth.signIn({ email, password })
//   const result = await supabaseStrategy.authenticate(request, sessionStorage, {
//     sessionKey: 'sb:session',
//   })

//   console.log(result)

//   if (result) {
//     return redirect('/profile')
//   }

//   // if (result.error) {
//   //   return json({ error: result.error }, 400)
//   // }

//   // if (result.session) {
//   //   try {
//   //     await createUserSession(result.session.access_token)
//   //   } catch (error) {
//   //     console.error(error)
//   //     return json({ error: { message: 'Error creating user session.' } }, 500)
//   //   }
// }

// export default function Login() {
//   return (
//     <>
//       <WhoaForm
//         formTitle="Login"
//         inputConfigs={loginInputs}
//         submitTitle="Login With Supabase"
//       />

//       <div className="flex-center">
//         <Link to="/auth/signup" className="btn btn-primary">
//           Sign Up
//         </Link>
//       </div>
//     </>
//   )
// }
