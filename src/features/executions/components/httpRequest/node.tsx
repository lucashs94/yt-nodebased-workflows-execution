'use client'

import { HTTP_REQUEST_CHANNEL_NAME } from '@/inngest/channels/httpRequest'
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { GlobeIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { BaseExecutionNode } from '../baseExecutionNode'
import { fetchHttpRequestRealtimeToken } from './actions'
import { HttpRequestDialog, HttpRequestFormValues } from './dialog'

type HttpRequestNodeProps = {
  variableName?: string
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeProps>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchHttpRequestRealtimeToken,
  })

  const handleOpenSettings = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: HttpRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          }
        }

        return node
      })
    )
  }

  const nodeData = props.data
  const description = nodeData?.endpoint
    ? `${nodeData.method || 'GET'}: ${nodeData.endpoint}`
    : 'Not configured'

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})
