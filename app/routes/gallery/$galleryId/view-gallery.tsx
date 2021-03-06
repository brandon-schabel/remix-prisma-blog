import { Gallery, Photo } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { Image } from '~/components/Image'

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

export type ViewGalleryLoader = Gallery & {
  photos: Photo[]
}

export default function ViewGallery() {
  const data = useLoaderData<ViewGalleryLoader>()

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
