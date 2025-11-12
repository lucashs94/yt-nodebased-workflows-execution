'use client'

import { useNodeStatus } from '@/features/executions/hooks/useNodeStatus'
import { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../baseTriggerNode'
import { ConfigDialog } from './dialog'

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
  })

  const handleOpenSettings = () => {
    setOpen(true)
  }

  return (
    <>
      <ConfigDialog
        open={open}
        onOpenChange={setOpen}
      />

      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={'/logos/stripe.svg'}
        name="Stripe Trigger"
        description="when a stripe event is triggered"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
