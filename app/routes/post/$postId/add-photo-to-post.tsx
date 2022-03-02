import { ActionFunction } from 'remix'
import { errorMsg } from '~/utils/returnMessages'

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params.postId ? parseInt(params?.postId) : null
  if (postId === null) return { error: { message: 'No id provided' } }

  const formData = await request.formData()

  const photoId = formData.get('photoId') as string

  try {
    const result = await prismaDB?.photo.update({
      where: { id: photoId },
      data: { postId: postId },
    })
    return result
  } catch (error) {
    console.error(error)
    return errorMsg('Failed to add photo to post')
  }
}
