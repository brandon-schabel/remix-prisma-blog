import { LoaderFunction, useLoaderData } from 'remix'
import { User } from '@prisma/client'
import { getUser } from '~/utils/auth/getUser'

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  console.log(user)
  if(!user) return null
  return user
}


export default function Post() {
  const user = useLoaderData<User>()

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col justify-center items-center max-w-4xl w-full">
        <h1 className="text-xl text-center my-4">{user?.email}</h1>
      </div>
    </div>
  )
}
