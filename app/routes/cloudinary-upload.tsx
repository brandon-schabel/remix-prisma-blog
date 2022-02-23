import { unstable_parseMultipartFormData, useActionData, json } from 'remix'
import type { ActionFunction, UploadHandler } from 'remix'

import { uploadImage } from '~/utils/utils.server'
import { UploadApiResponse } from 'cloudinary'
import { prismaDB } from '~/utils/prisma.server'
import { getUser } from '~/utils/auth/getUser'
import { FormConfig } from '~/utils/formConfigs'
import { WhoaForm } from '~/components/WhoaForm'
import { FC } from 'react'
import { parseFormFields, processTags } from '~/utils/parseForm'

type ActionData = {
  errorMsg?: string
  imgSrc?: string
}

type appImageFields = {
  uploadedById: string
  title?: string
  description?: string
  tags?: string[]
  postId?: number
  galleryId?: number
}

const createImageInfoInDB = async (
  imageData: UploadApiResponse,
  appImageFields: appImageFields
) => {
  try {
    const photo = await prismaDB.photo.create({
      data: {
        ...appImageFields,
        bytes: imageData.bytes,
        etag: imageData.etag,
        height: imageData.height,
        width: imageData.width,
        format: imageData.format,
        originalFilename: imageData.original_filename,
        publicId: imageData.public_id,
        version: imageData.version,
        signature: imageData.signature,
        secureUrl: imageData.secure_url,
      },
    })

    return photo
  } catch (e) {
    console.error(e)
    return null
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return null
  const uploadHandler: UploadHandler = async ({ name, stream, filename }) => {
    if (name !== 'img') {
      stream.resume()
      return
    }

    try {
      const uploadedImage = await uploadImage(stream)
      if (!uploadedImage) return ''

      return JSON.stringify(uploadedImage)
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const imageData = formData.get('img') as string
  let postId = parseInt(formData.get('postId') as string)

  const formFieldResults = await parseFormFields(
    uploadImageConfigs,
    await formData,
    { tags: processTags }
  )

  const uploadedImageData = JSON.parse(imageData) as UploadApiResponse

  if (formFieldResults) {
    if (uploadedImageData) {
      const photo = await createImageInfoInDB(uploadedImageData, {
        uploadedById: user.id,
        description: formFieldResults.description,
        title: formFieldResults.title,
        tags: formFieldResults.tags,
        postId: postId,
      })

      if (!formFieldResults) {
        return json({
          error: 'something went wrong',
        })
      }
      return json({
        imgSrc: uploadedImageData.secure_url,
      })
    }
  }
  
  return json({
    error: { message: 'something went wrong' },
  })
}

export const uploadImageConfigs: FormConfig<any>[] = [
  { inputType: 'file', name: 'img', labelTitle: 'Image', accept: 'image/*' },
  { inputType: 'text', name: 'title', labelTitle: 'Title' },
  { inputType: 'text', name: 'description', labelTitle: 'Description' },
  { inputType: 'text', name: 'tags', labelTitle: 'Tags' },
]

export const CloudinarymageUploadForm: FC = () => {
  return (
    <WhoaForm
      formTitle="Upload Image"
      inputConfigs={uploadImageConfigs}
      encType="multipart/form-data"
      actionPath="/cloudinary-upload"
    />
  )
}

export default function Index() {
  const data = useActionData<ActionData>()
  return (
    <>
      <CloudinarymageUploadForm />
      {data?.errorMsg && <h2>{data.errorMsg}</h2>}
      {data?.imgSrc && (
        <>
          <h2>uploaded image</h2>
          <img src={data.imgSrc} />
        </>
      )}
    </>
  )
}
