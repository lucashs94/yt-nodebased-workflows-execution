'use client'

import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo } from 'react'
import { BaseTriggerNode } from '../baseTriggerNode'

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        // status={nodeStatus}
        // onSettings={handleOpenSettings}
        // onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
