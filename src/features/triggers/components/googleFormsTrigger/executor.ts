import { NodeExecutor } from '@/features/executions/types'
import { googleFormsTriggerChannel } from '@/inngest/channels/googleFormsTrigger'

type GoogleFormsTriggerData = Record<string, unknown>

export const googleFormsTriggerExecutor: NodeExecutor<
  GoogleFormsTriggerData
> = async ({ context, nodeId, step, publish }) => {
  await publish(
    googleFormsTriggerChannel().status({
      nodeId,
      status: 'loading',
    })
  )

  const result = await step.run('google-forms-trigger', async () => context)

  await publish(
    googleFormsTriggerChannel().status({
      nodeId,
      status: 'success',
    })
  )

  return result
}
