import { getExecutor } from '@/features/executions/lib/executorRegistry'
import { inngest } from '@/inngest/client'
import prisma from '@/lib/db'
import { NodeType } from '@/types/nodes'
import { NonRetriableError } from 'inngest'
import { googleFormsTriggerChannel } from './channels/googleFormsTrigger'
import { httpRequestChannel } from './channels/httpRequest'
import { manualTriggerChannel } from './channels/manualTrigger'
import { stripeTriggerChannel } from './channels/stripeTrigger'
import { topologicalSort } from './utils'

export const executeWorkflow = inngest.createFunction(
  {
    id: 'execute-workflow',
    retries: 0, // TODO: Change for deploy
  },
  {
    event: 'workflows/execute.workflow',
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormsTriggerChannel(),
      stripeTriggerChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId

    if (!workflowId) {
      throw new NonRetriableError('Workflow ID is missing')
    }

    const sortedNodes = await step.run('prepare-workflow', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      })

      return topologicalSort(workflow.nodes, workflow.connections)
    })

    // Initialize the context with initial data from trigger
    let context = event.data.initialData || {}

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string, unknown>,
        context,
        nodeId: node.id,
        step,
        publish,
      })
    }

    return {
      workflowId,
      context,
    }
  }
)
