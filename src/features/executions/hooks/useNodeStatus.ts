import { NodeStatus } from '@/components/reactFlow/node-status-indicator'
import type { Realtime } from '@inngest/realtime'
import { useInngestSubscription } from '@inngest/realtime/hooks'
import { useEffect, useState } from 'react'

interface UseNodeStatusOptions {
  nodeId: string
  channel: string
  topic: string
  refreshToken: () => Promise<Realtime.Subscribe.Token>
}

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) => {
  const [status, setStatus] = useState<NodeStatus>('initial')

  const { data } = useInngestSubscription({
    enabled: true,
    refreshToken,
  })

  useEffect(() => {
    if (!data.length) return

    const lastMessage = data
      .filter(
        (message) =>
          message.kind === 'data' &&
          message.channel === channel &&
          message.topic === topic &&
          message.data.nodeId === nodeId
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
  }, [data, channel, topic, nodeId])

  return status
}
