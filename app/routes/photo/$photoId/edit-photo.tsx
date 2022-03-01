import { Photo } from '@prisma/client'
import { ActionFunction, LoaderFunction, useLoaderData } from 'remix'
import { WhoaForm } from '~/components/WhoaForm'
import { textInput } from '~/utils/formUtils'
import { parseFormFields, processTags } from '~/utils/parseForm'
import { Image } from '~/components/Image'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

const editImageFields = [
  textInput('Title', 'title'),
  textInput('Description', 'description'),
  textInput('Tags', 'tags'),
]

export const action: ActionFunction = async ({ request, params }) => {
  const photoId = params.photoId

  const formData = await parseFormFields(
    editImageFields,
    await request.formData(),
    { tags: processTags }
  )

  if (!photoId) return null
  if (!formData) return null

  const title = formData.title
  const description = formData.description
  const tags = formData.tags

  try {
    const photo = await prismaDB?.photo.update({
      where: {
        id: photoId,
      },
      data: {
        title,
        description,
        tags,
      },
    })
    return { info: { message: 'Photo updated' } }
  } catch (error) {
    console.error(error)
    return { error: { message: 'Error updating photo' } }
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const photoId = params.photoId

  const photo = await prismaDB?.photo.findUnique({
    where: {
      id: photoId,
    },
  })

  if (!photo) return { error: { message: 'No photo' } }

  return { photo }
}

export default function EditPhoto() {
  const data = useLoaderData<{ photo: Photo } | null>()
  const photo = data?.photo
  if (!photo) return null
  return (
    <div>
      <div className="flex justify-center w-full" style={{ height: '80vh' }}>
        <Image
          url={resizeCloudinaryUrl(photo.secureUrl || '')}
          className="w-auto h-full"
        />
      </div>
      <WhoaForm
        formTitle="Edit Photo"
        inputConfigs={editImageFields}
        data={photo}
      />
    </div>
  )
}
