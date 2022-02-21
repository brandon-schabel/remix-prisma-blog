import { Authenticator } from 'remix-auth'
import { Auth0Profile, Auth0Strategy } from 'remix-auth-auth0'
import { userStorageServer } from './userStorageServer.server'

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<Auth0Profile | null>(
  userStorageServer
)

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK || '',
    clientID: 'VrCZtRljSRZdQWO0OFudo7Vg0xktUQ76',
    clientSecret:
      'ZHP3rnXIadSOjynOvIzMLfmXOw5wZPX2apL3n6mpDfHDUhbr_hx1ugTHxoZuON2b',
    domain: 'dev-vup8eamx.us.auth0.com',
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    // return User.findOrCreate({ email: profile.emails[0].value })

    return profile
  }
)

authenticator.use(auth0Strategy)
