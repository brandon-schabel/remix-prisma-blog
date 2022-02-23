import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix'
import { Post, User } from '@prisma/client'
import { prismaDB } from '~/utils/prisma.server'
import { CustomElement, CustomText } from 'types'
import { FC } from 'react'
import { imageClasses } from '~/components/EditorImage'
import { ElementAttributes } from '~/components/TextEditor/TextEditor'
import { getUser } from '~/utils/auth/getUser'
import { isPostCreatorOrAdmin } from './edit-post'
import { ActionMessages } from '~/components/ActionMessages'
import { BannerWarningMessage } from '~/components/BannerWarningMessage'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)

  const postId = parseInt(params?.postId || '0')
  const post = await prismaDB.post.findUnique({
    where: {
      id: postId,
    },
    include: { author: true },
  })

  if (!post) return null
  if (!isPostCreatorOrAdmin(post, user) && !post.published) return redirect('/')
  const data = await request.formData()
  const publishPostId = parseInt(data.get('postId') as string)

  if (publishPostId === post.id) {
    const result = await prismaDB.post.update({
      where: { id: publishPostId },
      data: { published: !post.published, updatedAt: new Date() },
    })
    if (result.published) {
      return json({ info: { message: 'Post published' } })
    }

    if (!result.published) {
      return json({ error: { message: 'Post unpublished' } })
    }
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)

  const postId = parseInt(params?.postId || '0')
  const post = await prismaDB.post.findUnique({
    where: {
      id: postId,
    },
    include: { author: true },
  })

  if (!post) return null
  if (!isPostCreatorOrAdmin(post, user) && !post.published) return redirect('/')

  return {
    post,
    author: post?.author,
    userCanEdit: user ? isPostCreatorOrAdmin(post, user) : false,
  }
}

export interface ExtendedCustomText extends CustomText {
  bold?: boolean
  italic?: boolean
  code?: boolean
}

export interface ExtendedCustomElement extends CustomElement {
  children: ExtendedCustomText[]
}

export type AppNode = Node & {
  type: string
  url?: string // for images
}

interface ImageProps {
  attributes: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  element: AppNode
}

export const Image: FC<{ url: string }> = ({ url }) => {
  return (
    <img
      src={resizeCloudinaryUrl(url)}
      className={imageClasses + ' rounded mb-2'}
    />
  )
}

export const ImageNode: FC<ImageProps> = ({
  attributes,
  children,
  element,
}) => {
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative">
        <Image url={element.url || ''} />
      </div>
    </div>
  )
}

export const ImageThumbnail: FC<{ url: string }> = ({ url }) => {
  return <img height={'50px'} width="auto" src={url} className="max-h-24" />
}

export interface ViewElementProps {
  attributes: ElementAttributes
  element: AppNode
}

export const ViewElement: FC<ViewElementProps> = ({
  attributes,
  children,
  element,
}) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return (
        <h1 className="text-3xl" {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 className="text-2xl" {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'image':
      return (
        <ImageNode
          attributes={attributes}
          element={element}
          children={children}
        />
      )
    default:
      return (
        <p {...attributes} className="text-center">
          {children}
        </p>
      )
  }
}

export default function View() {
  const { post, author, userCanEdit } =
    useLoaderData<{ post: Post; author: User; userCanEdit: boolean }>()
  const title = post.title || ''
  const content = post.content as unknown as ExtendedCustomElement[]
  if (!content) return null

  return (
    <div className="flex w-full justify-center items-center flex-col">
      <ActionMessages />
      {!post.published && (
        <BannerWarningMessage message="This Post Is Not Yet Published" />
      )}
      <div className="flex flex-col justify-center items-center max-w-4xl w-full">
        <h1 className="text-xl text-center my-4">{title}</h1>

        {content.map(node => {
          if (node.type === 'image') {
            return (
              <div className="flex w-full justify-center items-center">
                <ImageNode key={node.url} element={node} />
              </div>
            )
          }
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
      <div>Posted By {` ${author.firstName} ${author.lastName}`}</div>
      {userCanEdit && (
        <Link className="btn btn-primary" to={`/post/${post.id}/edit-post`}>
          Edit
        </Link>
      )}
      {userCanEdit && (
        <Form method="post">
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="submit"
            className={`btn ${post.published ? 'btn-error' : 'btn-success'}`}
          >
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
        </Form>
      )}
    </div>
  )
}
