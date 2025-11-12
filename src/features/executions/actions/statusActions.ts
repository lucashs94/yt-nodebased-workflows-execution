'use server'

import { statusChannel } from '@/inngest/channels/statusChannel'
import { inngest } from '@/inngest/client'
import { getSubscriptionToken, Realtime } from '@inngest/realtime'

export type StatusToken = Realtime.Token<typeof statusChannel, ['status']>

export async function fetchStatusRealtimeToken(): Promise<StatusToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: statusChannel(),
    topics: ['status'],
  })

  return token
}
