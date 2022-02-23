import {
  ActionFunction,
  json,
  LoaderFunction,
  Outlet,
  useLoaderData,
} from 'remix'
import { User } from '@prisma/client'
import { getUser } from '~/utils/auth/getUser'
import { WhoaForm } from '~/components/WhoaForm'
import { parseFormFields } from '~/utils/parseForm'
import { FormConfig } from '~/utils/formConfigs'

type LoaderReturn = { user: User; inputs: FormConfig<any>[] }

const profileInputs: Record<string, FormConfig<any>> = {
  firstName: { inputType: 'text', name: 'firstName', labelTitle: 'First Name' },
  lastName: { inputType: 'text', name: 'lastName', labelTitle: 'Last Name' },
  username: {
    inputType: 'text',
    name: 'username',
    labelTitle: 'Username',
    labelSubtitle: 'Username can only be set once.',
  },
}
const editProfileInputs: FormConfig<any>[] = [
  profileInputs.firstName,
  profileInputs.lastName,
  profileInputs.username,
]

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return null
  const formData = await parseFormFields<'firstName' | 'lastName' | 'username'>(
    editProfileInputs,
    await request.formData()
  )

  if (!formData) return json({ error: { message: 'Invalid form data' } })

  const updateData: any = {
    firstName: formData.firstName,
    lastName: formData.lastName,
  }

  // if user doesn't have a username, then it can be updated
  if (formData.username && !user.username) {
    updateData.username = formData.username
  }

  try {
    await prismaDB?.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return json({ info: { message: 'Profile updated' } })
  } catch (error) {
    console.error(error)
    return { error: { message: 'Error updating profile' } }
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return null

  const usernameInputCopy = { ...profileInputs.username }
  usernameInputCopy.disabled = !!user.username

  const editProfileInputs: FormConfig<any>[] = [
    profileInputs.firstName,
    profileInputs.lastName,
    usernameInputCopy,
  ]

  return { user, inputs: editProfileInputs } as LoaderReturn
}

export default function Post() {
  const { inputs, user } = useLoaderData<LoaderReturn>()

  return (
    <div className="flex w-full justify-center items-center">
      <WhoaForm
        formTitle="Edit Profile"
        data={user}
        className="w-full max-w-4xl mx-4"
        inputConfigs={inputs}
      />
    </div>
  )
}
