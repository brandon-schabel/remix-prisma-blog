import { Gallery, Photo, Post, User } from '@prisma/client'
import { Link } from 'react-router-dom'
import { ActionFunction, Form, LoaderFunction, useLoaderData } from 'remix'
import { ActionMessages } from '~/components/ActionMessages'
import { Image } from '~/components/Image'
import { getUser } from '~/utils/auth/getUser'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)
  if (!user) return null
  const formData = await request.formData()

  const galleryId = parseInt(formData.get('galleryId') as string)
  const photoId = formData.get('photoId') as string

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

  if (!photo) return null
  const showEditButton = user.id === photo.uploadedBy.id || user.isAdmin

  return { photo, showEditButton }
}

type PhotoType = Photo & {
  uploadedBy: User
  post?: Post
  gallery?: Gallery
}
type LoaderData = {
  photo: PhotoType
  showEditButton: boolean
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
            url={resizeCloudinaryUrl(photo.secureUrl, 2400)}
            className="w-auto h-full"
          />
        </div>
        <div className='flex-center flex-col'>
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

          {photo.gallery && (
            <Form method="post">
              <input value={photo.id} hidden name="photoId" />
              <input value={photo?.galleryId || ''} hidden name="galleryId" />
              <button type="submit" className="btn btn-primary my-2">
                Set Gallery Header
              </button>
            </Form>
          )}

          {data.showEditButton && (
            <Link
              className="btn btn-primary my-2"
              to={`/photo/${photo.id}/edit-photo`}
            >
              Edit Photo
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
