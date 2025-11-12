import { NodeStatus } from '@/components/reactFlow/node-status-indicator'
import { channel, topic } from '@inngest/realtime'

export const STATUS_CHANNEL = 'STATUS_CHANNEL'

export const statusChannel = channel(STATUS_CHANNEL).addTopic(
  topic('status').type<{ nodeId: string; status: NodeStatus }>()
)
