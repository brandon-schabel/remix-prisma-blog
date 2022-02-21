import { FC, useState } from 'react'
import { ActionFunction, json, redirect, useFetcher, useSubmit } from 'remix'
import { prismaDB } from '~/utils/prisma.server'
import { Descendant } from 'slate'

import { CustomText } from 'types'
import { useEffect } from 'react'
import { TextEditor } from '~/components/TextEditor/TextEditor'
import { useLocalStorage } from '~/utils/useLocalStorage'
import { getUser } from '~/utils/auth/getUser'
import { ExtendedCustomElement } from './post/$postId/view-post'
import { ActionMessage } from '~/components/ActionErrorMessage'

const initialValue: CustomDescendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'This is editable ' }],
  },
]

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user?.authorizedPoster) {
    return json({
      error: {
        message: 'You are not an authorized user.',
      },
    })
  }
  const data = await request.formData()
  const title = data.get('title') as string
  const content = data.get('content') as string

  const parsedContent = JSON.parse(content) as Descendant[]

  try {
    const post = await prismaDB.post.create({
      data: {
        title: title || '',
        content: parsedContent || '',
        authorId: user.id,
      },
    })

    return redirect('/post/' + post.id)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const Label: FC<{ htmlFor: string }> = ({ children, htmlFor }) => {
  return (
    <label className="label label-text my-2" htmlFor={htmlFor}>
      {children}
    </label>
  )
}

export type UploadReturnTypes = {
  error?: string
  imgSrc?: string
}

export type CustomDescendant = ExtendedCustomElement | CustomText

export default function CreatePost() {
  const uploader = useFetcher<UploadReturnTypes>()
  const [imageUrls, setImageUrls] = useLocalStorage<string[]>(
    'createPostImageUrls',
    []
  )
  const [value, setValue] = useLocalStorage<CustomDescendant[]>(
    'createPostContent',
    initialValue
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
      <ActionMessage />
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
          <input name="title" className="input input-primary my-6" />

          <TextEditor value={value} setValue={setValue} />

          <button type="submit" className="btn btn-primary my-10">
            Create Post
          </button>
        </form>
      </div>
    </div>
  )
}
