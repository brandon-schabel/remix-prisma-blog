export const errorMsg = (message: string) => {
  return { error: { message } }
}

export const infoMsg = (message: string) => {
  return { info: { message } }
}
