import { Post } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { prismaDB } from '~/utils/prisma.server'

export const loader: LoaderFunction = async () => {
  const posts = await prismaDB.post.findMany()

  return posts
}

export default function Index() {
  const posts = useLoaderData<Post[]>()
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {posts.map(post => (
        <Link to={`/post/${post.id}`}>
          <div className="flex justify-center items-center w-96 card card-bordered bg-neutral">
            <div className="card-title" key={post.id}>
              {post.title}
            </div>

            <div className="card-body">{post.content.substring(0, 100)}</div>
            <hr />
          </div>
        </Link>
      ))}
    </div>
  )
}
