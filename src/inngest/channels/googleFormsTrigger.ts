import { channel, topic } from '@inngest/realtime'

export const GOOGLE_FORMS_TRIGGER_CHANNEL_NAME = 'googleFormsTriggerExecution'

export const googleFormsTriggerChannel = channel(
  GOOGLE_FORMS_TRIGGER_CHANNEL_NAME
).addTopic(
  topic('status').type<{
    nodeId: string
    status: 'loading' | 'success' | 'error'
  }>()
)
