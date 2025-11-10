'use client'

import { useNodeStatus } from '@/features/executions/hooks/useNodeStatus'
import { GOOGLE_FORMS_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/googleFormsTrigger'
import { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../baseTriggerNode'
import { fetchGoogleFormsTriggerRealtimeToken } from './actions'
import { GoogleFormsTriggerDialog } from './dialog'

export const GoogleFormsTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORMS_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGoogleFormsTriggerRealtimeToken,
  })

  const handleOpenSettings = () => {
    setOpen(true)
  }

  return (
    <>
      <GoogleFormsTriggerDialog
        open={open}
        onOpenChange={setOpen}
      />

      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={'/logos/googleform.svg'}
        name="Google Form Trigger"
        description="when a form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
