import { Gallery, Photo, Post, User } from '@prisma/client'
import { Link } from 'react-router-dom'
import { ActionFunction, Form, LoaderFunction, useLoaderData } from 'remix'
import { ActionMessages } from '~/components/ActionMessages'
import { Image } from '~/routes/post/$postId/view-post'
import { getUser } from '~/utils/auth/getUser'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)
  if (!user) return null
  const formData = await request.formData()

  const galleryId = parseInt(formData.get('galleryId') as string)
  const photoId = formData.get('photoId') as string

  console.log(galleryId, photoId)
  if (!galleryId) return null
  if (!photoId) return null

  const galleryUpdateResult = await prismaDB?.gallery.update({
    where: { id: galleryId },
    data: { galleryPhotoHeaderId: photoId },
  })

  console.info('Gallery Update Result', galleryUpdateResult)
  return {
    info: {
      message: 'Gallery photo header updated',
    },
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  if (!user) return null

  if (!params.photoId) return null

  const photo = await prismaDB?.photo.findUnique({
    where: {
      id: params.photoId,
    },
    include: { uploadedBy: true, post: true, gallery: true },
  })

  return { photo }
}

type PhotoType = Photo & {
  uploadedBy: User
  post?: Post
  gallery?: Gallery
}
type LoaderData = {
  photo: PhotoType
}

export default function ViewImages() {
  const data = useLoaderData<LoaderData>()

  const photo = data.photo

  return (
    <div>
      <ActionMessages />
      <div key={photo.id}>
        <div className="flex justify-center w-full" style={{ height: '80vh' }}>
          <Image
            url={resizeCloudinaryUrl(photo.secureUrl)}
            className="w-auto h-full"
          />
        </div>
        <div>
          <p>
            Posted By {photo.uploadedBy?.firstName} {photo.uploadedBy?.lastName}
          </p>
          <p>{photo.title}</p>
          {photo.description && <p>Description {photo.description}</p>}

          {photo.post && (
            <p>
              <Link to={`/post/${photo.postId}/view-post`}>
                Post: {photo.post.title}
              </Link>
            </p>
          )}

          {photo.gallery && (
            <Link to={`/gallery/${photo.gallery?.id}/view-gallery`}>
              <p>Gallery: {photo.gallery?.name}</p>
            </Link>
          )}
          {photo.gallery && (
            <Link to={`/gallery/${photo.gallery?.id}/view-gallery`}>
              View Gallery
            </Link>
          )}

          <Form method="post">
            <input value={photo.id} hidden name="photoId" />
            <input value={photo?.galleryId || ''} hidden name="galleryId" />
            <button type="submit" className="btn btn-primary">
              Set Gallery Header
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}
