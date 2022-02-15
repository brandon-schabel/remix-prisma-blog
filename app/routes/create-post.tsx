import { Post } from '@prisma/client'
import { FC } from 'react'
import { ActionFunction, redirect, useLoaderData } from 'remix'
import { prismaDB } from '~/utils/prisma.server'

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  const title = data.get('title') as string
  const content = data.get('content') as string
  const username = data.get('username') as string
  const password = data.get('password') as string

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    console.log('got here')
    return null
  }

  try {
    const post = await prismaDB.post.create({
      data: { title: title || '', content: content || '' },
    })

    return redirect('/post/' + post.id)
  } catch (error) {
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

export default function Index() {
  return (
    <div className="flex flex-col justify-center max-w-screen-xl w-full">
      <form method="post" className="flex flex-col">
        <Label htmlFor="username">Username</Label>
        <input name="username" className="input input-primary" />
        <Label htmlFor="password">Password</Label>
        <input
          name="password"
          type="password"
          className="input input-primary"
        />

        <Label htmlFor="title">Title</Label>
        <input name="title" className="input input-primary" />

        <Label htmlFor="content">Content</Label>
        <textarea name="content" className="input input-primary" />

        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  )
}
