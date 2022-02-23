import { Gallery, Photo, Post, User } from '@prisma/client'
import { Link } from 'react-router-dom'
import {
  ActionFunction,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from 'remix'
import { ActionMessages } from '~/components/ActionMessages'
import { getUser } from '~/utils/auth/getUser'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) return null

  const formData = await request.formData()
  const galleryId = parseInt(formData.get('galleryId') as string)
  const photoId = formData.get('photoId') as string
  console.log(photoId)

  if (!galleryId) return { error: { message: 'No gallery id' } }
  if (!photoId) return { error: { message: 'No photo id' } }

  try {
    const gallery = await prismaDB?.gallery.update({
      where: {
        id: galleryId,
      },
      data: {
        photos: { connect: { id: photoId } },
      },
    })
    return {
      info: {
        message: 'Photo added to gallery',
        link: {
          to: `/gallery/${galleryId}/view-gallery`,
          title: 'View Gallery',
        },
      },
    }
  } catch (e) {
    return { error: { message: 'invalid Gallery' } }
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  if (!user) return null

  const photos = await prismaDB?.photo.findMany({
    include: { uploadedBy: true, post: true, gallery: true },
  })

  return { photos }
}

type PhotoType = Photo & {
  uploadedBy: User
  post?: Post
  gallery?: Gallery
}
type LoaderData = {
  photos: PhotoType[]
}

export default function ViewImages() {
  const data = useLoaderData<LoaderData>()

  return (
    <div>
      <ActionMessages />
      {data &&
        data.photos.map(photo => {
          return (
            <div key={photo.id}>
              <Link to={`/photo/${photo.id}/view-photo`}>View Photo</Link>
              <img src={resizeCloudinaryUrl(photo.secureUrl, 300)} />
              <div>
                <p>
                  Posted By {photo.uploadedBy?.firstName}{' '}
                  {photo.uploadedBy?.lastName}
                </p>
                <p>{photo.title}</p>

                {photo.post && (
                  <p>
                    <Link to={`/post/${photo.postId}/view-post`}>
                      Post: {photo.post.title}
                    </Link>
                  </p>
                )}

                {photo.gallery && <p>Gallery: {photo.gallery?.name}</p>}
                <p className="mt-12">Add To Gallery</p>
                <form method="post">
                  <input type="text" name="photoId" value={photo.id} hidden />
                  <input type="number" name="galleryId" />

                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )
        })}
    </div>
  )
}
