import { FC } from 'react'
import { useSlate, useSlateStatic } from 'slate-react'
import {insertImage, isBlockActive, isImageUrl, isMarkActive, toggleBlock, toggleMark } from './utils'

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
    >
      {format}
      {/* {icon} */}
      {/* <Icon>{icon}</Icon> */}
    </Button>
  )
}

export const InsertImageButton = () => {
  const editor = useSlateStatic()
  return (
    <Button
      isActive={false}
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the image:')
        if (url && !isImageUrl(url)) {
          alert('URL is not an image')
          return
        }
        if (url) {
          insertImage(editor, url)
        }
      }}
    >
      Insert Image
    </Button>
  )
}
