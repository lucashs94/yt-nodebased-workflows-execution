import { useTRPC } from '@/trpc/client'
import { CredentialType } from '@/types/credentials'
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCredentialsParams } from './useCredentialsParams'

/**
 * Hook to fetch all credentials using suspense
 * @returns The list of credentials for the authenticated user.
 */
export const useSuspenseCredentials = () => {
  const trpc = useTRPC()
  const [params] = useCredentialsParams()

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

/**
 * Hook to create new credential
 */
export const useCreateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
      },
      onError: (error) => {
        toast.error(`Error creating credential: ${error.message}`)
      },
    })
  )
}

/**
 * Hook to remove a credential
 */
export const useRemoveCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        toast.error(`Error removing credential: ${error.message}`)
      },
    })
  )
}

/**
 * Hook get a single credential
 */
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }))
}

/**
 * Hook get credentials by type
 */
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC()

  return useQuery(trpc.credentials.getByType.queryOptions({ type }))
}

/**
 * Hook to update a credential
 */
export const useUpdateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id })
        )
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`)
      },
    })
  )
}
