import { Gallery, Photo } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import {Image} from '~/components/Image'

export const loader: LoaderFunction = async ({ request }) => {
  const galleries = await prismaDB?.gallery.findMany({
    include: { galleryPhotoHeader: true, photos: { take: 1 } },
  })

  return { galleries }
}

export type GalleryWithPhotos = Gallery & {
  galleryPhotoHeader: Photo
  photos: Photo[]
}

export default function EditPost() {
  const { galleries } = useLoaderData<{ galleries: GalleryWithPhotos[] }>()

  return (
    <div>
      {galleries.map(gallery => {
          const { galleryPhotoHeader, photos } = gallery
          const selectedPhotoHeader = galleryPhotoHeader || photos[0]
          
        return (
          <Link to={`/gallery/${gallery.id}/view-gallery`}>
            <div key={gallery.id} className="flex start items-center flex-col">
              <div className="flex justify-center items-center flex-col">
                <Image
                  url={selectedPhotoHeader.secureUrl}
                  width={600}
                  className="rounded-full h-80 w-80 object-cover"
                />
              </div>
              <h2>{gallery.name}</h2>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
