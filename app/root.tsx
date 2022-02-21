import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix'
import type { MetaFunction } from 'remix'
import appStyleUrl from '~/styles/app.css'
import { getUser, getUserAuth } from './utils/auth/getUser'

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: appStyleUrl }]
}

export const meta: MetaFunction = () => {
  return { title: 'Blog' }
}

type ResourceLink = {
  to: string
  label: string
  reloadDocument?: boolean
}
const baseNavLinks: ResourceLink[] = [{ label: 'Home', to: '/' }]

export const loader: LoaderFunction = async ({ params, request }) => {
  const userAuth = await getUserAuth(request)
  const loaderResult = { navLinks: baseNavLinks }

  const unauthedNavLinks: ResourceLink[] = [
    ...baseNavLinks,
    { label: 'Login', to: '/auth/login' },
    { label: 'Sign Up', to: '/auth/signup' },
  ]

  if (!userAuth) {
    return { navLinks: unauthedNavLinks }
  }

  const authedNavLinks: ResourceLink[] = [
    ...baseNavLinks,
    { label: 'Logout', to: '/auth/logout', reloadDocument: true },
    { label: 'Profile', to: '/profile' },
  ]

  if (userAuth) {
    const user = await getUser(request)
    if (user?.authorizedPoster) {
      authedNavLinks.push({ label: 'Create Post', to: '/create-post' })
    }

    return { navLinks: authedNavLinks }
  }

  return null
}
export default function App() {
  const { navLinks } = useLoaderData<{ navLinks: ResourceLink[] }>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="mr-2"
              reloadDocument={link.reloadDocument}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
