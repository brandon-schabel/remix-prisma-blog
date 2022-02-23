import cloudinary from 'cloudinary'

const parseStart = 'https://res.cloudinary.com/dfqtpr6f0/image/upload/'

export const resizeCloudinaryUrl = (url?: string, width = 1200) => {
  if (!url) return ''
  const split = url.split(parseStart)
  const resized = parseStart + `w_${width},c_scale/` + split[1]

  return resized
}
