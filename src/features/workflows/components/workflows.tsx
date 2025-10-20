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
import { Workflow } from '@/generated/prisma'
import { useEntitySearch } from '@/hooks/useEntitySearch'
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import { formatDistanceToNow } from 'date-fns'
import { WorkflowIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from '../hooks/useWorkflows'
import { useWorkflowsParams } from '../hooks/useWorkflowsParams'

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows()

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(item) => item.id}
      renderItem={(item) => <WorkflowItem data={item} />}
      emptyView={<WorkflowsEmpty />}
    />
  )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow()
  const { handleError, upgradeModal } = useUpgradeModal()
  const router = useRouter()

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: handleError,
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      },
    })
  }

  return (
    <>
      {upgradeModal}

      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        newButtonLabel="New workflow"
        onNew={handleCreate}
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  )
}

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams()
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  })

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search workflows..."
    />
  )
}

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows()
  const [params, setParams] = useWorkflowsParams()

  return (
    <EntityPagination
      page={workflows.data?.page || 1}
      totalPages={workflows.data?.totalPages || 1}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={workflows.isFetching}
    />
  )
}

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows..." />
}

export const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows..." />
}

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow()
  const { handleError, upgradeModal } = useUpgradeModal()
  const router = useRouter()

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: handleError,
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      },
    })
  }

  return (
    <>
      {upgradeModal}
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first"
        onNew={handleCreate}
      />
    </>
  )
}

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow()

  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id })
  }

  return (
    <EntityItem
      href={`/workflows/${data.id}`}
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
          <WorkflowIcon className="size-5 text-muted-foreground " />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  )
}
