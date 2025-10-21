'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { forwardRef, type ReactNode } from 'react'

import { BaseNode } from '@/components/reactFlow/base-node'

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode
  onClick?: () => void
}

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, onClick }, ref) => {
    return (
      <BaseNode
        ref={ref}
        className="w-auto h-auto border-dashed border-gray-400 bg-card p-4 cursor-pointer text-center text-gray-400 shadow-none hover:border-gray-500 hover:bg-gray-50"
        onClick={onClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: 'hidden' }}
          position={Position.Top}
          isConnectable={false}
        />

        <Handle
          type="source"
          style={{ visibility: 'hidden' }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    )
  }
)

PlaceholderNode.displayName = 'PlaceholderNode'
