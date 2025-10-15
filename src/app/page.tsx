import { requireAuth } from '@/lib/auth-utils'

export default async function Page() {
  await requireAuth()

  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-6 items-center justify-center">
      protected server comp.
    </div>
  )
}
