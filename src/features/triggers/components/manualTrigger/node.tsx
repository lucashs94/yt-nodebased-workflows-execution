'use client'

import { useNodeStatus } from '@/features/executions/hooks/useNodeStatus'
import { MANUAL_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/manualTrigger'
import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../baseTriggerNode'
import { fetchManualTriggerRealtimeToken } from './actions'
import { ManualTriggerDialog } from './dialog'

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchManualTriggerRealtimeToken,
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
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
