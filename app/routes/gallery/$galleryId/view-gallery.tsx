import { Gallery, Photo } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { Image } from '~/routes/post/$postId/view-post'

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.galleryId) return null

  const gallery = await prismaDB?.gallery.findUnique({
    where: {
      id: Number(params.galleryId),
    },
    include: { photos: true },
  })

  return gallery
}

type LoaderData = Gallery & {
  photos: Photo[]
}

export default function EditPost() {
  const data = useLoaderData<LoaderData>()

  return (
    <div className="w-full flex">
      <div className="w-full flex flex-wrap">
        {data.photos.map(photo => {
          return (
            <Link className="mr-4" to={`/photo/${photo.id}/view-photo`}>
              <Image url={photo.secureUrl} className="max-h-96" />
              <div className="mt-2">{photo.title}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
