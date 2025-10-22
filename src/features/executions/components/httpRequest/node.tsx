'use client'

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { GlobeIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseExecutionNode } from '../baseExecutionNode'
import { FormType, HttpRequestDialog } from './dialog'

type HttpRequestNodeProps = {
  endPoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: string
  [key: string]: unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeProps>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setNodes } = useReactFlow()

  const nodeStatus = 'initial'

  const handleOpenSettings = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: FormType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endPoint: values.endpoint,
              method: values.method,
              body: values.body,
            },
          }
        }

        return node
      })
    )
  }

  const nodeData = props.data
  const description = nodeData.endPoint
    ? `${nodeData.method || 'GET'}: ${nodeData.endPoint}`
    : 'Not configured'

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endPoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
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
