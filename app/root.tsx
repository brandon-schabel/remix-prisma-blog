import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'
import appStyleUrl from '~/styles/app.css'

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: appStyleUrl }]
}

export const meta: MetaFunction = () => {
  return { title: 'Blog' }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body >
        <Link className="py-4" to="/">
          Home
        </Link>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
