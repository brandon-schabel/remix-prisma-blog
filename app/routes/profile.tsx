import { Link, LoaderFunction, Outlet, useLoaderData } from 'remix'
import { User } from '@prisma/client'
import { getUser } from '~/utils/auth/getUser'

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  if (!user) return null
  return user
}

export default function Profile() {
  const user = useLoaderData<User>()

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-xl text-center my-4">{user?.email}</h1>
        <h1>{`${user.firstName} ${user.lastName}`}</h1>
        <Link to="./edit-profile">Edit Profile</Link>

        <Outlet />
      </div>
    </div>
  )
}
