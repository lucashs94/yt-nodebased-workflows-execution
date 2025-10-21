'use client'

import { Position } from '@xyflow/react'
import { LucideIcon } from 'lucide-react'
import { memo } from 'react'
import { WorkflowNode } from '../../../components/nodes/workflowNode'
import { BaseHandle } from '../../../components/reactFlow/base-handle'
import {
  BaseNode,
  BaseNodeContent,
} from '../../../components/reactFlow/base-node'

interface BaseTriggerNodeProps {
  icon: LucideIcon | string
  name: string
  description?: string
  children?: React.ReactNode
  // status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseTriggerNode = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const handleDelete = () => {
      console.log('delete node')
    }

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <BaseNode
          onDoubleClick={onDoubleClick}
          className="rounded-l-2xl relative group"
        >
          <BaseNodeContent>
            {typeof Icon === 'string' ? (
              <img
                src={Icon}
                alt={name}
                width={16}
                height={16}
              />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}

            {children}

            <BaseHandle
              id={`source-1`}
              type="source"
              position={Position.Right}
            />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    )
  }
)

BaseTriggerNode.displayName = 'BaseTriggerNode'
