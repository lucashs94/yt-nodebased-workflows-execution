import { NodeExecutor } from '@/features/executions/types'
import { statusChannel } from '@/inngest/channels/statusChannel'

type StripeTriggerData = Record<string, unknown>

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(
    statusChannel().status({
      nodeId,
      status: 'loading',
    })
  )

  const result = await step.run('stripe-trigger', async () => context)

  await publish(
    statusChannel().status({
      nodeId,
      status: 'success',
    })
  )

  return result
}
