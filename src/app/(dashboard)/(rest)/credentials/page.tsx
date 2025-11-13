import {
  Container,
  CredentialsList,
  Error,
  Loading,
} from '@/features/credentials/components/credentials'
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader'
import { prefetchCredentials } from '@/features/credentials/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { SearchParams } from 'nuqs'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  await requireAuth()

  const params = await credentialsParamsLoader(searchParams)
  prefetchCredentials(params)

  return (
    <Container>
      <HydrateClient>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </Container>
  )
}
