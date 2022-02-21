import { Post } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { PostContent } from '~/components/ViewPost'
import { prismaDB } from '~/utils/prisma.server'

export const loader: LoaderFunction = async () => {
  const posts = await prismaDB.post.findMany({ orderBy: { createdAt: 'desc' } })

  return posts
}

export default function Index() {
  const posts = useLoaderData<Post[]>()
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {posts.map(post => (
        <Link to={`/post/${post.id}/view-post`}>
          <div className="flex justify-center items-center w-96 card card-bordered shadow-lg my-8 p-4">
            <div className="card-title text-center" key={post.id}>
              {post.title}
            </div>

            <div className="card-body">
              <PostContent post={post} />
            </div>
            <hr />
          </div>
        </Link>
      ))}
    </div>
  )
}
