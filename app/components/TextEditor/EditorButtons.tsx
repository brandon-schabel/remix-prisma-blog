import { Photo, Post } from '@prisma/client'
import { FC, useState } from 'react'
import { LoaderFunction, useLoaderData } from 'remix'
import { useSlate, useSlateStatic } from 'slate-react'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'
import {
  insertImage,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from './utils'

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isActive: boolean
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  isActive,
  ...rest
}) => {
  const activeClass = isActive ? 'btn-active ' : ''
  return (
    <button className={`btn btn-primary ${activeClass}` + className} {...rest}>
      {children}
    </button>
  )
}

interface MarkBlockButtonProps {
  format: string
  icon?: string
}

export const BlockButton: FC<MarkBlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      isActive={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      className="btn-sm mr-2 "
    >
      {/* <Icon>{icon}</Icon> */}
      {/* {icon} */}
      {format}
    </Button>
  )
}

export const MarkButton: FC<MarkBlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      isActive={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      className="btn-sm mr-2 mb-2"
    >
      {format}
      {/* {icon} */}
      {/* <Icon>{icon}</Icon> */}
    </Button>
  )
}

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params.postId
  if (!postId) return { photos: [] }

  const post = await prismaDB?.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    include: { photos: true },
  })

  return { photos: post?.photos }
}

const Modal: FC<{ isOpen: boolean; closeModal: () => void }> = ({
  isOpen,
  children,
  closeModal,
}) => {
  if (!isOpen) return null
  return (
    <div className="modal modal-open">
      <div className="modal-box md:max-w-4xl">
        <div className="w-full justify-center items-center flex my-2">
          <h1 className="text-xl">Insert Image</h1>
        </div>
        {children}
        <div className="w-full justify-center items-center flex my-2">
          <button className="btn btn-primary" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export const InsertImageButton: FC = () => {
  const data = useLoaderData<{ post: Post & { photos: Photo[] } }>()
  const [modalOpen, setModalOpen] = useState(false)
  const editor = useSlateStatic()

  const openModal = (event: any) => {
    event.preventDefault()
    setModalOpen(!modalOpen)
  }

  const handleSelectImage = (photo: Photo) => {
    insertImage(editor, photo)
    setModalOpen(false)
  }

  return (
    <>
      <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
        <div className="carousel carousel-center">
          {data.post?.photos &&
            data.post?.photos.map(photo => {
              return (
                <div className="carousel-item mr-2">
                  <button onClick={() => handleSelectImage(photo)}>
                    <img
                      src={resizeCloudinaryUrl(photo.secureUrl)}
                      className="w-52 h-auto rounded shadow-lg"
                    />
                  </button>
                </div>
              )
            })}
        </div>
      </Modal>
      <button onClick={openModal} className="btn btn-primary btn-sm mr-2 mb-2">
        Insert Image
      </button>
    </>
  )
}
