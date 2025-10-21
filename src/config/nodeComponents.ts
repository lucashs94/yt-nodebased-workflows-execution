import { InitialNode } from '@/components/nodes/initialNode'
import { NodeType } from '@/types/nodes'
import { NodeTypes } from '@xyflow/react'

import { HttpRequestNode } from '@/features/executions/components/httpRequest/node'
import { ManualTriggerNode } from '@/features/triggers/components/manualTrigger/node'

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes

export type RegisteredNodeTypes = keyof typeof nodeComponents
