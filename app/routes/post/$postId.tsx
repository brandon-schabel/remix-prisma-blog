import { LoaderFunction, useLoaderData } from 'remix'
import { Post } from '@prisma/client'
import { prismaDB } from '~/utils/prisma.server'

export const loader: LoaderFunction = async ({ params }) => {
  const postId = parseInt(params?.postId || '0')
  const posts = await prismaDB.post.findUnique({
    where: {
      id: postId,
    },
  })

  return posts
}

export default function Post() {
  const post = useLoaderData<Post>()
  const title = post.title || ''
  const content = post.content || ''

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-xl text-center my-4">{title}</h1>

      <p className="text-center">{content}</p>
    </div>
  )
}
