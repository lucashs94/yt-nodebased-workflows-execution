import { InitialNode } from '@/components/nodes/initialNode'
import { NodeType } from '@/generated/prisma'
import { NodeTypes } from '@xyflow/react'

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes

export type RegisteredNodeTypes = keyof typeof nodeComponents
