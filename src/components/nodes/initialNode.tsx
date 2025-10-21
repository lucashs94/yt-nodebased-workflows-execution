'use client'

import type { NodeProps } from '@xyflow/react'
import { PlusIcon } from 'lucide-react'
import { memo } from 'react'
import { PlaceholderNode } from '../reactFlow/placeholder-node'
import { WorkflowNode } from './workflowNode'

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode showToolbar={false}>
      <PlaceholderNode
        {...props}
        onClick={() => {}}
      >
        <div className="flex items-center justify-center cursor-pointer">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  )
})

InitialNode.displayName = 'InitialNode'
