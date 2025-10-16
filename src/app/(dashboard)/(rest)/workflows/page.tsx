import { requireAuth } from '@/lib/auth-utils'

export default async function Page() {
  await requireAuth()

  return (
    <div>
      <h1>Workflows Page</h1>
    </div>
  )
}
