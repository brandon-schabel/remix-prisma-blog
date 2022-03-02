import { FC } from 'react'
import { useFetcher } from 'remix'
import { uploadImageConfigs } from '~/routes/cloudinary-upload'
import { UploadReturnTypes } from '~/routes/post/$postId/edit-post'
import { hiddenInput, textInput } from '~/utils/formUtils'
import { renderInputConfigs } from './WhoaForm'

export const UploadImageForm: FC<{ postId?: string; galleryId?: string }> = ({
  postId,
  galleryId,
}) => {
  const uploader = useFetcher<UploadReturnTypes>()
  console.log(postId, galleryId)
  return (
    <uploader.Form
      method="post"
      encType="multipart/form-data"
      action="/cloudinary-upload"
    >
      {renderInputConfigs(uploadImageConfigs)}
      {postId && renderInputConfigs([hiddenInput('postId', postId)])}
      {galleryId && renderInputConfigs([hiddenInput('galleryId', galleryId)])}

      <button type="submit" className="btn btn-primary">
        Start Upload
      </button>
    </uploader.Form>
  )
}
