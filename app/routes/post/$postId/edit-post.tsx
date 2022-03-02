import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
  useSubmit,
} from 'remix'
import { prismaDB } from '~/utils/prisma.server'
import { Descendant } from 'slate'

import { FC, useState } from 'react'
import { TextEditor } from '~/components/TextEditor/TextEditor'
import { getUser } from '~/utils/auth/getUser'
import { ExtendedCustomElement } from './view-post'
import { Photo, Post, User } from '@prisma/client'
import { ActionMessages } from '~/components/ActionMessages'
import { CustomText } from 'types'
import { initialValue } from '~/routes/create-post'
import { UploadImageForm } from '~/components/UploadImageForm'
import { Modal } from '~/components/TextEditor/EditorButtons'
import { useEffect } from 'react'
import { WhoaForm } from '~/components/WhoaForm'
import { selectInput } from '~/utils/formUtils'
import { GalleryWithPhotos } from '~/routes/gallery/view-galleries'
import { ViewGalleryLoader } from '~/routes/gallery/$galleryId/view-gallery'
import { Image } from '~/components/Image'
export const Label: FC<{ htmlFor: string }> = ({ children, htmlFor }) => {
  return (
    <label
      className="label label-text my-2 text-xl font-bold"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}

export type CustomDescendant = ExtendedCustomElement | CustomText

export type UploadReturnTypes = {
  error?: string
  imgSrc?: string
}

export const isPostCreatorOrAdmin = (
  post: Post & { author: User },
  currentUser: User | null | undefined
) => {
  if (!currentUser) return false
  return post.author.id === currentUser.id || currentUser.isAdmin
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)
  if (!user) return redirect('/auth/login')
  const postId = params?.postId ? parseInt(params?.postId) : null

  if (postId === null) return { error: { message: 'No id provided' } }
  let post

  try {
    post = await prismaDB.post.findUnique({
      where: { id: postId },
      include: { author: true },
    })
  } catch (error) {
    console.error(error)
    return { error: { message: 'Error retrieving post' } }
  }

  if (!post) return { error: { message: 'Post not found' } }

  if (!isPostCreatorOrAdmin(post, user)) {
    return json(
      {
        error: {
          message: 'You are not the author of this post.',
        },
      },
      400
    )
  }

  const data = await request.formData()
  const title = data.get('title') as string
  const content = data.get('content') as string

  const parsedContent = JSON.parse(content) as Descendant[]

  try {
    const postUpdate = await prismaDB.post.update({
      where: {
        id: postId,
      },
      data: {
        title: title || '',
        content: parsedContent || '',
        updatedAt: new Date(),
      },
    })

    return redirect('/post/' + post.id + '/view-post')
  } catch (error) {
    console.error(error)
    return { error: { message: 'Error updating post' } }
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  if (!user) return redirect('/')
  const postId = parseInt(params?.postId || '0')

  const post = await prismaDB.post.findUnique({
    where: {
      id: postId,
    },
    include: { author: true, photos: true },
  })

  if (!post) return null

  if (!isPostCreatorOrAdmin(post, user)) return redirect('/')

  return { post }
}

export const GalleryPhotoModal: FC<{
  postId: string
  closeModal: Function
}> = ({ postId, closeModal }) => {
  const galleryFetcher = useFetcher<ViewGalleryLoader>()
  const galleriesFetcher = useFetcher<{ galleries: GalleryWithPhotos[] }>()
  const addPhotoToPostFetcher = useFetcher()

  useEffect(() => {
    if (galleriesFetcher.type === 'init') {
      galleriesFetcher.load('/gallery/view-galleries')
    }
  }, [galleriesFetcher])

  // useEffect(() => {

  // },[galleries])

  console.log(galleriesFetcher.data)

  const selectOptions = galleriesFetcher?.data?.galleries.map(gallery => {
    return {
      label: gallery.name,
      value: gallery.id.toString(),
    }
  })

  const inputConfig = selectOptions
    ? [selectInput('Gallery', 'galleryId', selectOptions)]
    : null

  const handleSelectGallery = async (event: any) => {
    event.preventDefault()

    console.log(event.target)

    const galleryId = await event.currentTarget.galleryId.value

    console.log(galleryId)

    galleryFetcher.load(`/gallery/${galleryId}/view-gallery`)
  }

  const handleAddPhotoToPost = async (event: any, photo: Photo) => {
    event.preventDefault()

    const result = await addPhotoToPostFetcher.submit(
      { photoId: photo.id },
      { method: 'post', action: `/post/${postId}/add-photo-to-post` }
    )

    console.log(result)
  }
  console.log(selectOptions)

  const galleryPhotos = galleryFetcher.data?.photos

  return (
    <Modal isOpen={true} closeModal={closeModal}>
      {inputConfig && selectOptions && (
        <WhoaForm
          formTitle="Select Gallery"
          inputConfigs={[selectInput('Gallery', 'galleryId', selectOptions)]}
          clientSubmit={event => handleSelectGallery(event)}
        ></WhoaForm>
      )}

      {galleryPhotos && (
        <div className="flex flex-wrap w-full">
          {galleryPhotos.map(photo => {
            if (photo.postId) return null

            return (
              <button
                className="w-auto h-32 mr-4"
                onClick={event => handleAddPhotoToPost(event, photo)}
              >
                <Image url={photo.secureUrl} width={120} />
              </button>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export default function EditPost() {
  const { post } = useLoaderData<{ post: Post }>()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [value, setValue] = useState<CustomDescendant[]>(
    (post?.content as Descendant[]) || initialValue
  )
  const [galleryPhotoModal, setGalleryPhotoModal] = useState(false)
  const [title, setTitle] = useState(post?.title || '')
  const submit = useSubmit()

  const submitPost = (event: any) => {
    event.preventDefault()
    const content = JSON.stringify(value)

    const data = {
      title,
      content,
    }

    submit(data, { method: 'post' })
  }

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <ActionMessages />
      <div className="flex flex-col  items-center justify-center max-w-screen-xl w-full">
        <div className="flex flex-col w-full">
          <Label htmlFor="title">Title</Label>
          <input
            value={title}
            name="title"
            className="input input-primary mb-2"
            defaultValue={post.title}
            onChange={event => setTitle(event.target.value)}
          />
          <div className="flex flex-col mb-2">
            <TextEditor value={value} setValue={setValue} />
          </div>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn btn-primary"
          >
            {showUploadForm ? 'Close Form' : 'Upload Photos'}
          </button>
          {showUploadForm && (
            <UploadImageForm postId={post.id.toString() || ''} />
          )}

          <button
            className="btn btn-primary"
            onClick={() => setGalleryPhotoModal(!galleryPhotoModal)}
          >
            Add Photo From Gallery
          </button>

          {galleryPhotoModal && (
            <GalleryPhotoModal
              postId={post.id}
              closeModal={() => setGalleryPhotoModal(false)}
            />
          )}

          <button
            type="submit"
            className="btn btn-primary my-10"
            onClick={submitPost}
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  )
}
