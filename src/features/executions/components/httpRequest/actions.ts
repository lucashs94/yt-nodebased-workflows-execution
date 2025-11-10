'use server'

import { httpRequestChannel } from '@/inngest/channels/httpRequest'
import { inngest } from '@/inngest/client'
import { getSubscriptionToken, Realtime } from '@inngest/realtime'

export type HttpRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ['status']
>

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ['status'],
  })

  return token
}
