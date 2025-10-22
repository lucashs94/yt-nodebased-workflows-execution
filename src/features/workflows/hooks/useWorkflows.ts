import { useTRPC } from '@/trpc/client'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useWorkflowsParams } from './useWorkflowsParams'

/**
 * Hook to fetch all workflows using suspense
 * @returns The list of workflows for the authenticated user.
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC()
  const [params] = useWorkflowsParams()

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

/**
 * Hook to create new workflow
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`)
      },
    })
  )
}

/**
 * Hook to remove a workflow
 */
export const useRemoveWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        toast.error(`Error removing workflow: ${error.message}`)
      },
    })
  )
}

/**
 * Hook get a single workflow
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }))
}

/**
 * Hook to update a workflow name
 */
export const useUpdateWorkflowName = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        toast.error(`Error updating workflow: ${error.message}`)
      },
    })
  )
}

/**
 * Hook to update a workflow
 */
export const useUpdateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        toast.error(`Failed to save workflow: ${error.message}`)
      },
    })
  )
}
