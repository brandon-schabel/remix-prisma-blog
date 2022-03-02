import React, { FC, useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate, ReactEditor } from 'slate-react'
import { createEditor, Descendant, BaseEditor } from 'slate'
import { withHistory } from 'slate-history'
import { EditorImage } from '../EditorImage'
import { BlockButton, InsertImageButton, MarkButton } from './EditorButtons'
import { toggleMark } from './utils'
import { AppNode } from '~/routes/post/$postId/view-post'

export type EditorType = BaseEditor & ReactEditor

export const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

export const LIST_TYPES = ['numbered-list', 'bulleted-list']

export type ElementAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<any>,
  any
>
interface ElementProps {
  attributes: ElementAttributes
  element: AppNode
}

const EditorElements: FC<ElementProps> = ({
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
        <EditorImage
          attributes={attributes}
          element={element}
          children={children}
        />
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

export type EmptyText = {
  text: string
}

export type ImageElement = {
  type: 'image'
  url: string
  id: string
  publicId: string
  title: string
  description: string
  children: EmptyText[]
}

type AppLeaf = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

interface LeafProps {
  attributes: ElementAttributes
  leaf: AppLeaf
}

const Leaf: FC<LeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

interface TextEditorProps {
  setValue: React.Dispatch<React.SetStateAction<Descendant[]>>
  value: Descendant[]
}

export const TextEditor: FC<TextEditorProps> = ({ value, setValue }) => {
  const renderElement = useCallback(props => <EditorElements {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <div>
        <MarkButton format="bold" icon="format_bold"/>
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <InsertImageButton />
      </div>
      <Editable
        className="textarea textarea-primary"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}
