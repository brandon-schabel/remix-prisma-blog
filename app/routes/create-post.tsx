import { FC, useState } from 'react'
import { ActionFunction, redirect, useFetcher, useSubmit } from 'remix'
import { prismaDB } from '~/utils/prisma.server'
import { Descendant } from 'slate'

import { Button, TextEditor } from '~/components/TextEditor'
import { ExtendedCustomElement } from './post/$postId'
import { CustomText } from 'types'
import { useEffect } from 'react'

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  const title = data.get('title') as string
  const content = data.get('content') as string
  const username = data.get('username') as string
  const password = data.get('password') as string

  const parsedContent = JSON.parse(content) as Descendant[]

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    console.log('Invalid username and password')
    return null
  }

  try {
    const post = await prismaDB.post.create({
      data: { title: title || '', content: parsedContent || '' },
    })

    return redirect('/post/' + post.id)
  } catch (error) {
    console.error(error)
    return null
  }
}

const Label: FC<{ htmlFor: string }> = ({ children, htmlFor }) => {
  return (
    <label className="label label-text my-2" htmlFor={htmlFor}>
      {children}
    </label>
  )
}

type UploadReturnTypes = {
  error?: string
  imgSrc?: string
}

export type CustomDescendant = ExtendedCustomElement | CustomText
export default function Index() {
  const uploader = useFetcher<UploadReturnTypes>()
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (uploader.data?.imgSrc) {
      // if imgSrc doesn't exists in imageUrls, add it
      if (!imageUrls?.includes(uploader.data.imgSrc)) {
        setImageUrls([...imageUrls, uploader.data.imgSrc])
      }
    }
  }, [uploader.data])

  const [value, setValue] = useState<CustomDescendant[]>([
    {
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: 'bold', bold: true },
        {
          text: ', or add a semantically rendered block quote in the middle of the page, like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ])
  const submit = useSubmit()

  const submitForm = (event: any) => {
    event.preventDefault()

    const username = event.currentTarget.username.value
    const password = event.currentTarget.password.value
    const title = event.currentTarget.title.value
    const content = JSON.stringify(value)

    const data = {
      username,
      password,
      title,
      content,
    }

    submit(data, { method: 'post' })
  }

  return (
    <div className="flex items-center justify-start w-fulls">
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

        {imageUrls.map(url => (
          <p>{url}</p>
        ))}

        <form method="post" className="flex flex-col" onSubmit={submitForm}>
          <Label htmlFor="username">Username</Label>
          <input name="username" className="input input-primary" />
          <Label htmlFor="password">Password</Label>
          <input
            name="password"
            type="password"
            className="input input-primary"
          />

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
