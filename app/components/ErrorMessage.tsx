import { useActionData } from 'remix'

export const ErrorMessage = () => {
  const action = useActionData<any>()
  if (!action?.error?.message) return null

  return (
    <div className="bg-error rounded">
      <p>{action.error.message}</p>
    </div>
  )
}
