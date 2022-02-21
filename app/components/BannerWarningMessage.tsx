import { FC } from 'react'

export const BannerWarningMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="bg-error rounded my-1">
      <p>{message}</p>
    </div>
  )
}
