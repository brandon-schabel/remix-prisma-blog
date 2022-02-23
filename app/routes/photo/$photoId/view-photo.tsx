import { Gallery, Photo, Post, User } from '@prisma/client'
import { Link } from 'react-router-dom'
import { LoaderFunction, useLoaderData } from 'remix'
import { getUser } from '~/utils/auth/getUser'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

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
      <div key={photo.id}>
        <img src={resizeCloudinaryUrl(photo.secureUrl, 1200)} />
        <div>
          <p>
            Posted By {photo.uploadedBy?.firstName} {photo.uploadedBy?.lastName}
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
        </div>
      </div>
    </div>
  )
}
