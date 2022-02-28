import {
  LoaderFunction,
  redirect,
  useFetcher,
  useParams,
} from 'remix'
import { ActionMessages } from '~/components/ActionMessages'
import { renderInputConfigs } from '~/components/WhoaForm'
import { uploadImageConfigs } from '~/routes/cloudinary-upload'
import { UploadReturnTypes } from '~/routes/post/$postId/edit-post'
import { getUser } from '~/utils/auth/getUser'

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request)
  if (!user) return redirect('/auth/login')

  return {}
}

export default function UploadPhotoToGallery() {
  const uploader = useFetcher<UploadReturnTypes>()
  const params = useParams()

  return (
    <>
      <ActionMessages />
      <uploader.Form
        method="post"
        encType="multipart/form-data"
        action="/cloudinary-upload"
      >
        {renderInputConfigs(uploadImageConfigs)}
        <input name="galleryId" value={params.galleryId} hidden={true} />

        <button type="submit" className="btn btn-primary">
          Upload Photo
        </button>
      </uploader.Form>
    </>
  )
}
