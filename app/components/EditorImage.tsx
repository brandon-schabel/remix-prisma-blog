import { FC, useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useFocused, useSlateStatic } from 'slate-react'
import { AppNode } from '~/routes/post/$postId/view-post'
import { Button } from './TextEditor/EditorButtons'

export const imageClasses = 'block w-auto max-h-96 shadow'

interface IEditorImage {
  element: AppNode
  attributes: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}

export const EditorImage: FC<IEditorImage> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlateStatic()
  //@ts-ignore
  const path = ReactEditor.findPath(editor, element)
  const [selected, setSelected] = useState<boolean>()

  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative">
        <img
          onClick={() => setSelected(!selected)}
          src={element.url}
          className={imageClasses}
          style={{
            boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`,
          }}
        />
        <Button
          isActive
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className="absolute top-2 left-2 bg-white"
          style={{ display: `${selected && focused ? 'inline' : 'none'}` }}
        >
          Delete
          {/* {"Delete Icon"} */}
        </Button>
      </div>
    </div>
  )
}
