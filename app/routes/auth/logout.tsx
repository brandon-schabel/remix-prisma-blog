import { ActionFunction, LoaderFunction, redirect } from 'remix'
import { authenticator } from '~/utils/auth/auth.server'

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/' })
}

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/' })
}
