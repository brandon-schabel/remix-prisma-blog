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

import { useEffect } from 'react'
import { TextEditor } from '~/components/TextEditor/TextEditor'
import { useLocalStorage } from '~/utils/useLocalStorage'
import { getUser } from '~/utils/auth/getUser'
import {
  CustomDescendant,
  Label,
  UploadReturnTypes,
} from '~/routes/create-post'
import { Post, User } from '@prisma/client'
import { ErrorMessage } from '~/components/ErrorMessage'

export const isPostCreatorOrAdmin = (
  post: Post & { author: User },
  currentUser: User
) => {
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

  console.log(post.author, user)

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
    include: { author: true },
  })
  if (!post) return null

  if (!isPostCreatorOrAdmin(post, user)) return redirect('/')

  return { post }
}

export default function EditPost() {
  const { post } = useLoaderData<{ post: Post }>()
  const uploader = useFetcher<UploadReturnTypes>()
  const [imageUrls, setImageUrls] = useLocalStorage<string[]>(
    'createPostImageUrls' + post.id,
    []
  )
  const [value, setValue] = useLocalStorage<CustomDescendant[]>(
    'updatePost' + post?.id,
    post.content
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
    }

    submit(data, { method: 'post' })
  }

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <ErrorMessage />
      <div className="flex flex-col  items-center justify-center max-w-screen-xl w-full">
        <uploader.Form
          method="post"
          encType="multipart/form-data"
          action="/cloudinary-upload"
        >
          <Label htmlFor="ImageName">Image Name</Label>
          <input type="text" name="imageName" />

          <Label htmlFor="ImageFile">Image File</Label>
          <input type="file" name="img" accept="image/*" />
          <button type="submit" className="btn btn-primary">
            upload to cloudinary
          </button>
        </uploader.Form>
        <p>Image Urls</p>

        {Array.isArray(imageUrls) && imageUrls.map(url => <p>{url}</p>)}

        <form method="post" className="flex flex-col" onSubmit={submitForm}>
          <Label htmlFor="title">Title</Label>
          <input
            name="title"
            className="input input-primary my-6"
            defaultValue={post.title}
          />

          <TextEditor value={value} setValue={setValue} />

          <button type="submit" className="btn btn-primary my-10">
            Update Post
          </button>
        </form>
      </div>
    </div>
  )
}
