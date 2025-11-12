import { NodeExecutor } from '@/features/executions/types'
import { statusChannel } from '@/inngest/channels/statusChannel'

type GoogleFormsTriggerData = Record<string, unknown>

export const googleFormsTriggerExecutor: NodeExecutor<
  GoogleFormsTriggerData
> = async ({ context, nodeId, step, publish }) => {
  await publish(
    statusChannel().status({
      nodeId,
      status: 'loading',
    })
  )

  const result = await step.run('google-forms-trigger', async () => context)

  await publish(
    statusChannel().status({
      nodeId,
      status: 'success',
    })
  )

  return result
}
