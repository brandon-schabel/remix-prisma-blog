import { FC } from 'react'
import { resizeCloudinaryUrl } from '~/utils/cloudinaryImageUrlResize'
import { imageClasses } from './EditorImage'

export const Image: FC<{ url: string; width?: number; className?: string }> = ({
  url,
  width,
  className,
}) => {
  return (
    <img
      src={resizeCloudinaryUrl(url, width)}
      className={imageClasses + ' rounded mb-2 ' + className}
    />
  )
}
