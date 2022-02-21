import { createCookieSessionStorage } from 'remix'


export const userStorageServer = createCookieSessionStorage({
  cookie: {
    name: '__user',
    secrets: ['...'],
    sameSite: 'lax',
    path: '/',
  },
})
