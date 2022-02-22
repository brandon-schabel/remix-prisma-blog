import {
  Form,
  unstable_parseMultipartFormData,
  useActionData,
  json,
  UploadHandler,
  redirect,
} from 'remix'
import type { ActionFunction } from 'remix'
import { supabaseClient } from '~/utils/supabase'
import { getUser } from '~/utils/auth/getUser'
import { ActionMessages } from '~/components/ActionMessages'
import { Photo, PhotoSize } from '@prisma/client'
import sharp from 'sharp'

type ActionData = {
  errorMsg?: string
  imgSrc?: string
}

const getPhotoBuffer = async (photoBlob: Blob) => {
  const buffer = Buffer.from(await photoBlob.arrayBuffer())
  return buffer
}

type ImageSizeDimensions = {
  width?: number
  height?: number
}

const downloadImage = async (
  image: Photo & {
    photoSizes: PhotoSize[]
  },
  size: ImageSizeDimensions
) => {
  let photo: PhotoSize | null | undefined = null

  if (image.photoSizes.length > 0) {
    if (size.width && size.height) {
      photo = image.photoSizes.find(
        photoSize =>
          photoSize.width === size.width && photoSize.height === size.height
      )
    } else if (size.width) {
      photo = image.photoSizes.find(photoSize => photoSize.width === size.width)
    } else if (size.height) {
      photo = image.photoSizes.find(
        photoSize => photoSize.height === size.height
      )
    }
  }

  if (photo) {
    return photo.publicURL
  }

  // get original photo
  const photoBlob = await supabaseClient.storage
    .from(image.bucket)
    .download(image.filename)

  if (photoBlob.error) {
    return null
  }

  if (photoBlob.data === null) {
    return null
  }

  const photoBuffer = await getPhotoBuffer(photoBlob.data)
  if (photoBuffer === null) return null

  const sharpImage = sharp(photoBuffer, {})

  const imageExtension = image.filename.split('.').pop()
  const filenameNoExt = image.filename.split('.').slice(0, -1).join()
  let newFilename = ''

  if (size.width && size.height) {
    sharpImage.resize(size.width, size.height)
    newFilename = `${filenameNoExt}_w${size.width}xh${size.height}.${imageExtension}`
  } else if (size.width) {
    sharpImage.resize(size.width)
    newFilename = `${filenameNoExt}_w${size.width}.${imageExtension}`
  } else if (size.height) {
    sharpImage.resize(null, size.height)
    newFilename = `${filenameNoExt}_h${size.height}.${imageExtension}`
  }

  const jpegImage = sharpImage.toFormat('jpeg')
  const jpegBuffer = await jpegImage.toBuffer()

  // upload resized photo
  const { data, error } = await supabaseClient.storage
    .from('blog-photos')
    .upload(newFilename, jpegBuffer, {
      cacheControl: '3600',
      upsert: false,
    })

  if (data?.Key) {
    const { publicURL } = await supabaseClient.storage
      .from('blog-photos')
      .getPublicUrl(data.Key)

    if (publicURL) {
      prismaDB?.photoSize.create({
        data: {
          ...size,
          publicURL: publicURL,
          photo: { connect: { id: image.id } },
        },
      })
    }

    return publicURL
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return redirect('/auth/login')
  const bucket = 'blog-photos'
  const uploadHandler: UploadHandler = async ({ name, stream, filename }) => {
    if (name !== 'img') {
      stream.resume()
      return
    }

    console.log(bucket, filename)

    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filename, stream, {
        cacheControl: '3600',
        upsert: false,
      })

    return JSON.stringify({ key: data?.Key, filename })
  }

  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const data = formData.get('img') as string
  const parsedData = JSON.parse(data) as { key: string; filename: string }
  console.log(parsedData)

  const photo = await supabaseClient.storage
    .from(bucket)
    .getPublicUrl(parsedData.filename)

  if (!photo.publicURL) {
    return json({
      error: { message: 'something wrong' },
    })
  }

  try {
    const result = await prismaDB?.photo.create({
      data: {
        bucket,
        filename: parsedData.filename,
        publicURL: photo.publicURL,
        fileKey: parsedData.key,
        uploadedById: user.id,
      },
      include: {
        photoSizes: true,
      },
    })

    if (result) {
      const url = await downloadImage(result, { width: 1200 })
      const url2 = await downloadImage(result, { width: 1400 })
      const url3 = await downloadImage(result, { width: 1600 })
      console.log(url, url2, url3)
    }
  } catch (error) {
    console.error(error)
    return json({
      error: { message: 'Error adding image to DB' },
    })
  }

  return json({
    imgSrc: photo.publicURL,
  })
}

export default function SupabaseUpload() {
  const data = useActionData<ActionData>()
  return (
    <>
      <ActionMessages />
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="img" accept="image/*" />
        <button type="submit">upload image</button>
      </Form>
      {data?.errorMsg && <h2>{data.errorMsg}</h2>}
      {data?.imgSrc && (
        <>
          <h2>uploaded image</h2>
          <img alt="uploaded" src={data.imgSrc} />
        </>
      )}
    </>
  )
}
