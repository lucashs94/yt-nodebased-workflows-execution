import { realtimeMiddleware } from '@inngest/realtime/middleware'
import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'workflows-execution',
  middleware: [realtimeMiddleware()],
})
