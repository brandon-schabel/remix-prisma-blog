import { FC } from 'react'
import { Transforms } from 'slate'
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react'
import { Button } from './TextEditor'

export const Image: FC = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative">
        <img
          src={element.url}
          className="block w-full max-h-80 shadow"
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
