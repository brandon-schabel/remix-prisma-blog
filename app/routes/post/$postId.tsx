import { LoaderFunction, useLoaderData } from 'remix'
import { Post } from '@prisma/client'
import { prismaDB } from '~/utils/prisma.server'
import { Descendant } from 'slate'
import { CustomElement, CustomText } from 'types'

export const loader: LoaderFunction = async ({ params }) => {
  const postId = parseInt(params?.postId || '0')
  const posts = await prismaDB.post.findUnique({
    where: {
      id: postId,
    },
  })

  return posts
}

interface ExtendedCustomText extends CustomText {
  bold?: boolean
  italic?: boolean
  code?: boolean
}

export interface ExtendedCustomElement extends CustomElement {
  children: ExtendedCustomText[]
}

export default function Post() {
  const post = useLoaderData<Post>()
  const title = post.title || ''
  const content = post.content as unknown as ExtendedCustomElement[]

  //   console.log(content.)

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col justify-center items-center max-w-4xl w-full">
        <h1 className="text-xl text-center my-4">{title}</h1>

        {content.map(node => {
          if (node.type === 'paragraph') {
            return node.children.map(text => {
              if (text.bold) {
                return <span className="font-bold">{text.text}</span>
              }
              //   if(text.italic) {
              //       return <span className="font-">{text.text}</span>
              //   }
              // if(text.)
              return <p className="text-center">{text.text}</p>
            })
          }
        })}
      </div>
    </div>
  )
}
