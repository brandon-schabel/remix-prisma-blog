import { Post } from '@prisma/client'
import { FC } from 'react'
import { ExtendedCustomElement } from '~/routes/post/$postId/view-post'

export const PostContent: FC<{ post: Post }> = ({ post }) => {
  const content = post.content as unknown as ExtendedCustomElement[]

  if (!content) return null

  // get first two nodes from content
  const firstTwoNodes = content.slice(0, 2)

  return (
    <>
      {firstTwoNodes.map(node => {
        console.log(node)
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
    </>
  )
}
