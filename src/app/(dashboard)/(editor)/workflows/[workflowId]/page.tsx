import { requireAuth } from '@/lib/auth-utils'

interface PageProps {
  params: Promise<{
    workflowId: string
  }>
}

export default async function Page({ params }: PageProps) {
  await requireAuth()

  const { workflowId } = await params

  return (
    <div>
      <h1>Workflow ID Page</h1>
    </div>
  )
}
