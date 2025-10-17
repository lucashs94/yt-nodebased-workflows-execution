import { useTRPC } from '@/trpc/client'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook to fetch all workflows using suspense
 * @returns The list of workflows for the authenticated user.
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
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
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions())
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`)
      },
    })
  )
}
