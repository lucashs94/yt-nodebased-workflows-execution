'use client'

import { EntityContainer, EntityHeader } from '@/components/entityComponents'
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import { useRouter } from 'next/navigation'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/useWorkflows'

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows()

  return <pre>{JSON.stringify(workflows.data, null, 2)}</pre>
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow()
  const { handleError, upgradeModal } = useUpgradeModal()
  const router = useRouter()

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error)
      },
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

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}
