'use client'

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { BaseExecutionNode } from '../baseExecutionNode'
import { AVAILABLE_MODELS, ConfigDialog, FormValues } from './dialog'

type AnthropicNodeProps = {
  model?: (typeof AVAILABLE_MODELS)[number]
  credentialId?: string
  systemPrompt?: string
  userPrompt?: string
}

type AnthropicNodeType = Node<AnthropicNodeProps>

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
  })

  const handleOpenSettings = () => {
    setDialogOpen(true)
  }

  const handleSubmit = (values: FormValues) => {
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
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : 'Not configured'

  return (
    <>
      <ConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={'/logos/anthropic.svg'}
        name="Anthropic"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

AnthropicNode.displayName = 'AnthropicNode'
