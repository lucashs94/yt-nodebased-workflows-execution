import { NodeExecutor } from '@/features/executions/types'

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
}) => {
  // TODO: Publish "loading" state to this node

  const result = await step.run('manual-trigger', async () => context)

  // TODO: Publish "success" state to this node

  return result
}
