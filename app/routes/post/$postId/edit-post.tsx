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

import { FC, useEffect, useState } from 'react'
import { TextEditor } from '~/components/TextEditor/TextEditor'
import { getUser } from '~/utils/auth/getUser'
import { ExtendedCustomElement, ImageThumbnail } from './view-post'
import { Post, User } from '@prisma/client'
import { ActionMessages } from '~/components/ActionMessages'
import { renderInputConfigs } from '~/components/WhoaForm'
import { uploadImageConfigs } from '~/routes/cloudinary-upload'
import { CustomText } from 'types'
import { initialValue } from '~/routes/create-post'

export const Label: FC<{ htmlFor: string }> = ({ children, htmlFor }) => {
  return (
    <label className="label label-text my-2" htmlFor={htmlFor}>
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

  const post = await prismaDB.post.findUnique({
    where: { id: postId },
    include: { author: true },
  })

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
  const imageUrls = data.get('imageUrls') as string

  const parsedContent = JSON.parse(content) as Descendant[]
  const parsedImageUrls = JSON.parse(imageUrls) as string[]

  try {
    const postUpdate = await prismaDB.post.update({
      where: {
        id: postId,
      },
      data: {
        title: title || '',
        content: parsedContent || '',
        updatedAt: new Date(),
        images: parsedImageUrls || [],
      },
    })

    return redirect('/post/' + post.id + '/view-post')
  } catch (error) {
    console.error(error)
    return null
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

export default function EditPost() {
  const { post } = useLoaderData<{ post: Post }>()
  const uploader = useFetcher<UploadReturnTypes>()
  const [imageUrls, setImageUrls] = useState<string[]>(post.images)
  const [value, setValue] = useState<CustomDescendant[]>(
    (post?.content as Descendant[]) || initialValue
  )
  const submit = useSubmit()

  useEffect(() => {
    if (!uploader.data?.imgSrc) return
    if (!Array.isArray(imageUrls)) return

    // if imgSrc doesn't exists in imageUrls, add it
    if (!imageUrls?.includes(uploader.data.imgSrc)) {
      // if setImageUrls is a function, call it
      if (typeof setImageUrls === 'function') {
        setImageUrls([...imageUrls, uploader.data.imgSrc])
      }
    }
  }, [uploader.data])

  const submitForm = (event: any) => {
    event.preventDefault()

    const title = event.currentTarget.title.value
    const content = JSON.stringify(value)

    const data = {
      title,
      content,
      imageUrls: JSON.stringify(imageUrls),
    }

    submit(data, { method: 'post' })
  }

  const handleCopy = (event: any, value: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(value)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <ActionMessages />
      <div className="flex flex-col  items-center justify-center max-w-screen-xl w-full">
        <uploader.Form
          method="post"
          encType="multipart/form-data"
          action="/cloudinary-upload"
        >
          {renderInputConfigs(uploadImageConfigs)}
          <input name="postId" value={post.id} hidden={true} />

          <button type="submit" className="btn btn-primary">
            Upload Photo
          </button>
        </uploader.Form>
        <p>Image Urls</p>

        <div className="flex flex-col">
          <TextEditor value={value} setValue={setValue} />
        </div>

        <form method="post" className="flex flex-col w-full" onSubmit={submitForm}>
          <Label htmlFor="title">Title</Label>
          <input
            name="title"
            className="input input-primary my-6"
            defaultValue={post.title}
          />

          <button type="submit" className="btn btn-primary my-10">
            Update Post
          </button>
        </form>
      </div>
    </div>
  )
}
