import { redirect } from 'remix'
import { prismaDB } from '~/utils/prisma.server'
import { supabaseStrategy } from '~/utils/auth/auth.server'

export const getUserAuth = async (request: Request) => {
  try {
    const session = await supabaseStrategy.checkSession(request)

    return {
      id: session?.user?.id,
    }
  } catch (e) {
    console.log('Error getting supabase user', JSON.stringify(e))
    return null
  }
}

export const getUser = async (request: Request, successRedirect?: string) => {
  try {
    const session = await supabaseStrategy.checkSession(request)
    console.log(session)
    if (!session) {
      return null
    }

    const id = session.user?.id
    const email = session.user?.email
    if (id === undefined) return

    let userData = await prismaDB.user.findUnique({
      where: { id },
    })

    if (!userData) {
      console.log('got here')
      userData = await prismaDB.user.create({
        data: {
          id: session.user?.id || '',
          email: email || '',
          firstName: '',
          lastName: '',
          username: '',
        },
      })
    }

    return userData
  } catch (e) {
    console.log('Error getting supabase user data', e)
    return null
  }
}

// used when user auth is needed, but the user data is needede
export const requireAuthedUser = (request: Request) => {
  return async (loader: Function) => {
    const authResult = await getUserAuth(request)

    if (!authResult) {
      return redirect('/auth/login')
    }

    return loader(authResult)
  }
}
