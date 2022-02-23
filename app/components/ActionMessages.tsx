import { Link, useActionData } from 'remix'

export const ActionMessages = () => {
  const action = useActionData<any>()
  const infoMessage = action?.info?.message
  const errorMessage = action?.error?.message
  const infoLink = action?.info?.link?.to
  const infoLinkTitle = action?.info?.link?.title
  if (!infoMessage && !errorMessage) return null

  return (
    <>
      {errorMessage && (
        <div className={`bg-error rounded my-1`}>
          <p>{action.error.message}</p>
        </div>
      )}
      {infoMessage && (
        <div className={`bg-info rounded my-1`}>
          <p>{action.info.message}</p>
          {infoLink && <Link to={infoLink}>{infoLinkTitle}</Link>}
        </div>
      )}
    </>
  )
}
