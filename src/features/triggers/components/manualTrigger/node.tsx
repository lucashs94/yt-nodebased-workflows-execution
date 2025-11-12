'use client'

import { useNodeStatus } from '@/features/executions/hooks/useNodeStatus'
import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../baseTriggerNode'
import { ManualTriggerDialog } from './dialog'

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
  })

  const handleOpenSettings = () => {
    setOpen(true)
  }

  return (
    <>
      <ManualTriggerDialog
        open={open}
        onOpenChange={setOpen}
      />

      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="Manual Trigger"
        description={`when clicking 'Execute workflow'`}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
