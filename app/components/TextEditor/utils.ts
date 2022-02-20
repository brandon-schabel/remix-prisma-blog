import isUrl from 'is-url'
import imageExtensions from 'image-extensions'
import { EditorType, ImageElement, LIST_TYPES } from './TextEditor'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { CustomElement } from 'types'

export const isImageUrl = (url: string) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()

  if (ext) {
    return imageExtensions.includes(ext)
  }
}

export const insertImage = (editor: Editor, url: string) => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }

  // @ts-ignore
  Transforms.insertNodes(editor, image)
}

export const isMarkActive = (editor: EditorType, format: string) => {
  const marks = Editor.marks(editor)
  //@ts-ignore
  return marks ? marks[format] === true : false
}

export const isBlockActive = (editor: EditorType, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    //@ts-ignore
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] } as unknown as CustomElement
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor: EditorType, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}
