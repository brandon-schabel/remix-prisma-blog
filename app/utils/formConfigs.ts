import { Post, Comment, User } from '@prisma/client'

type HTMLInput = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type SelectType = { value: string; label: string }

export type FormConfig<ValidNameKeys> = {
  labelTitle: string
  labelSubtitle?: string
  name: ValidNameKeys
  inputType: HTMLInput['type'] | 'other'
  placeholder?: HTMLInput['placeholder']

  // add regex validation using pattern attribute
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
  }

  // list values are to give autocomplete like suggestions, not select
  listValues?: string[]
  inputMode?: HTMLInput['inputMode']
  select?: {
    options: SelectType[]
  }
  checkbox?: {
    value: string // set custom value for checkbox
  }

  group?: string
  disabled?: boolean
  accept?: string

  hidden?: boolean
  value?: string
  multiple?: boolean

  // TODO: server validation fields
}

export type PostKeys = keyof Post
export type UserKeys = keyof User
export type CommentKeys = keyof Comment
