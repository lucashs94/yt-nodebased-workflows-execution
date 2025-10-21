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

interface BaseExecutionNodeProps {
  id: string
  icon: LucideIcon | string
  name: string
  description?: string
  children?: React.ReactNode
  // status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseExecutionNode = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
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
        <BaseNode onDoubleClick={onDoubleClick}>
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
              id={`target-1`}
              type="target"
              position={Position.Left}
            />
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

BaseExecutionNode.displayName = 'BaseExecutionNode'
