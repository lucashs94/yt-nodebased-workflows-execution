'use server'

import { googleFormsTriggerChannel } from '@/inngest/channels/googleFormsTrigger'
import { inngest } from '@/inngest/client'
import { getSubscriptionToken, Realtime } from '@inngest/realtime'

export type GoogleFormsTriggerToken = Realtime.Token<
  typeof googleFormsTriggerChannel,
  ['status']
>

export async function fetchGoogleFormsTriggerRealtimeToken(): Promise<GoogleFormsTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormsTriggerChannel(),
    topics: ['status'],
  })

  return token
}
