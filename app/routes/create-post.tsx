import { LoaderFunction, redirect } from 'remix'
import { prismaDB } from '~/utils/prisma.server'
import { Descendant } from 'slate'

import { getUser } from '~/utils/auth/getUser'

export const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'This is editable ' }],
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user?.authorizedPoster) {
    return redirect('/auth/login')
  }

  const title = 'New Post'

  try {
    const post = await prismaDB.post.create({
      data: {
        title: title || '',
        content: initialValue,
        authorId: user.id,
      },
    })

    return redirect(`/post/${post.id}/edit-post`)
  } catch (error) {
    console.error(error)
    return null
  }
}
