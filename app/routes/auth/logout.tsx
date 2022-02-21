import { ActionFunction, LoaderFunction, redirect } from 'remix'
import { clearCookie } from '~/utils/supabase-sessions.server'

export let action: ActionFunction = async ({ request }): Promise<Response> => {
  return clearCookie(request)
}

export let loader: LoaderFunction = async () => {
  return redirect('/')
}
