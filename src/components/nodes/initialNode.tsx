'use client'

import type { NodeProps } from '@xyflow/react'
import { PlusIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { NodeSelector } from '../nodeSelector'
import { PlaceholderNode } from '../reactFlow/placeholder-node'
import { WorkflowNode } from './workflowNode'

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  return (
    <NodeSelector
      open={open}
      onOpenChange={setOpen}
    >
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode
          {...props}
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center justify-center cursor-pointer">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  )
})

InitialNode.displayName = 'InitialNode'
