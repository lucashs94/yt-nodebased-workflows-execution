import { requireAuth } from '@/lib/auth-utils'

interface PageProps {
  params: Promise<{
    executionId: string
  }>
}

export default async function Page({ params }: PageProps) {
  await requireAuth()

  const { executionId } = await params

  return (
    <div>
      <h1>Execution ID Page</h1>
    </div>
  )
}
