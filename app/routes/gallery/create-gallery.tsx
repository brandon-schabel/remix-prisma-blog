import { ActionFunction } from 'remix'
import { WhoaForm } from '~/components/WhoaForm'
import { getUser } from '~/utils/auth/getUser'
import { FormConfig } from '~/utils/formConfigs'
import { parseFormFields, processTags } from '~/utils/parseForm'

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return { error: { message: 'User not found' } }
  const data = await parseFormFields(createGalleryConfig, await request.formData(), {
    tags: processTags,
  })

  if (!data) return null

  try {
    const gallery = await prismaDB?.gallery.create({
      data: {
        name: data.name,
        tags: data.tags,
      },
    })
    return gallery
  } catch (e) {
    console.error(e)
    return null
  }
}

const createGalleryConfig: FormConfig<any>[] = [
  {
    name: 'name',
    inputType: 'text',
    labelTitle: 'Gallery Title',
    placeholder: 'Gallery Title',
  },
  {
    name: 'tags',
    inputType: 'text',
    labelTitle: 'Gallery Tags',
    placeholder: 'Gallery Tags',
  },
]

export default function EditPost() {
  return (
    <WhoaForm inputConfigs={createGalleryConfig} formTitle="Create Gallery" />
  )
}
