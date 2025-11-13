'use client'

import { useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/useNodeStatus'
import { BaseExecutionNode } from '../baseExecutionNode'
import { AVAILABLE_MODELS, ConfigDialog, FormValues } from './dialog'

type OpenAiNodeProps = {
  model?: (typeof AVAILABLE_MODELS)[number]
  credentialId?: string
  systemPrompt?: string
  userPrompt?: string
}

type OpenAiNodeType = Node<OpenAiNodeProps>

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
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
        icon={'/logos/openai.svg'}
        name="OpenAI"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
})

OpenAiNode.displayName = 'OpenAiNode'
