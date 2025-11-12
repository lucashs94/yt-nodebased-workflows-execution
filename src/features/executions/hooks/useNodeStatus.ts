import { NodeStatus } from '@/components/reactFlow/node-status-indicator'
import { STATUS_CHANNEL } from '@/inngest/channels/statusChannel'
import { useInngestSubscription } from '@inngest/realtime/hooks'
import { useEffect, useState } from 'react'
import { fetchStatusRealtimeToken, StatusToken } from '../actions/statusActions'

interface UseNodeStatusOptions {
  nodeId: string
}

export const useNodeStatus = ({ nodeId }: UseNodeStatusOptions) => {
  const [status, setStatus] = useState<NodeStatus>('initial')

  const { data } = useInngestSubscription<StatusToken>({
    enabled: true,
    refreshToken: fetchStatusRealtimeToken,
  })

  useEffect(() => {
    if (!data.length) return

    const lastMessage = data
      .filter(
        (message) =>
          message.kind === 'data' &&
          message.channel === STATUS_CHANNEL &&
          message.topic === 'status' &&
          message.data?.nodeId === nodeId
      )
      .sort((a, b) => {
        if (a.kind === 'data' && b.kind === 'data') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }

        return 0
      })[0]

    if (lastMessage?.kind === 'data') {
      setStatus(lastMessage.data.status as NodeStatus)
    }
  }, [data, nodeId])

  return status
}
