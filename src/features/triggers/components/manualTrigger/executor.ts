import { NodeExecutor } from '@/features/executions/types'
import { statusChannel } from '@/inngest/channels/statusChannel'

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
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

  const result = await step.run('manual-trigger', async () => context)

  await publish(
    statusChannel().status({
      nodeId,
      status: 'success',
    })
  )

  return result
}
