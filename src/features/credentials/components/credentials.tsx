'use client'

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from '@/components/entityComponents'
import { Credential } from '@/generated/prisma'
import { useEntitySearch } from '@/hooks/useEntitySearch'
import { CredentialType } from '@/types/credentials'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from '../hooks/useCredentials'
import { useCredentialsParams } from '../hooks/useCredentialsParams'

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials()

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(item) => item.id}
      renderItem={(item) => <Item data={item} />}
      emptyView={<Empty />}
    />
  )
}

export const Header = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonLabel="New credential"
      newButtonHref={'/credentials/new'}
      disabled={disabled}
    />
  )
}

export const Search = () => {
  const [params, setParams] = useCredentialsParams()
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  })

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials..."
    />
  )
}

export const Pagination = () => {
  const credentials = useSuspenseCredentials()
  const [params, setParams] = useCredentialsParams()

  return (
    <EntityPagination
      page={credentials.data?.page || 1}
      totalPages={credentials.data?.totalPages || 1}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={credentials.isFetching}
    />
  )
}

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<Header />}
      search={<Search />}
      pagination={<Pagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const Loading = () => {
  return <LoadingView message="Loading credentials..." />
}

export const Error = () => {
  return <ErrorView message="Error loading credentials..." />
}

export const Empty = () => {
  const router = useRouter()

  const handleCreate = () => {
    router.push('/credentials/new')
  }

  return (
    <EmptyView
      message="You haven't created any credentials yet. Get started by creating your first"
      onNew={handleCreate}
    />
  )
}

const credentialsLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: '/logos/openai.svg',
  [CredentialType.ANTHROPIC]: '/logos/anthropic.svg',
  [CredentialType.GEMINI]: '/logos/gemini.svg',
}

export const Item = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential()

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id })
  }

  const logo =
    credentialsLogos[data.type as CredentialType] || '/logos/openai.svg'

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{' '}
          &bull; Created{' '}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image
            src={logo}
            alt={data.type}
            width={20}
            height={20}
          />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  )
}
