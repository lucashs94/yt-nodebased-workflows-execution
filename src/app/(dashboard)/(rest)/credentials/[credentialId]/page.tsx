import { requireAuth } from '@/lib/auth-utils'

interface PageProps {
  params: Promise<{
    credentialId: string
  }>
}

export default async function Page({ params }: PageProps) {
  await requireAuth()

  const { credentialId } = await params

  return (
    <div>
      <h1>Credential ID Page</h1>
    </div>
  )
}
