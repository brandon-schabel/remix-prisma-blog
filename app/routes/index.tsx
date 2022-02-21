import { Post } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { PostContent } from '~/components/ViewPost'
import { getUser } from '~/utils/auth/getUser'
import { prismaDB } from '~/utils/prisma.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  // display published posts & posts by author(if they are unpublished)
  const whereCondition = {
    OR: [{ published: { equals: true } }, { authorId: { equals: user?.id } }],
  }
  // admin sees all posts
  const displayAll = user?.isAdmin ? true : false

  const posts = await prismaDB.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: displayAll ? {} : whereCondition,
  })

  return posts
}

export default function Index() {
  const posts = useLoaderData<Post[]>()
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {posts.map(post => (
        <Link to={`/post/${post.id}/view-post`}>
          <div
            className={`flex justify-center items-center w-96 card card-bordered shadow-lg my-8 p-4 ${
              !post.published ? 'border-error border-2' : ''
            }`}
          >
            <div className="card-title text-center" key={post.id}>
              {post.title}
            </div>

            <div className="card-body flex flex-col">
              <PostContent post={post} />
              {!post.published && (
                <p className="text-center text-error">Post is not published</p>
              )}
            </div>
            <hr />
          </div>
        </Link>
      ))}
    </div>
  )
}
