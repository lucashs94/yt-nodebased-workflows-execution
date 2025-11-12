import { InitialNode } from '@/components/nodes/initialNode'
import { NodeType } from '@/types/nodes'
import { NodeTypes } from '@xyflow/react'

import { AnthropicNode } from '@/features/executions/components/anthropic/node'
import { GeminiNode } from '@/features/executions/components/gemini/node'
import { HttpRequestNode } from '@/features/executions/components/httpRequest/node'
import { OpenAiNode } from '@/features/executions/components/openai/node'
import { GoogleFormsTriggerNode } from '@/features/triggers/components/googleFormsTrigger/node'
import { ManualTriggerNode } from '@/features/triggers/components/manualTrigger/node'
import { StripeTriggerNode } from '@/features/triggers/components/stripe-trigger/node'

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORMS_TRIGGER]: GoogleFormsTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
} as const satisfies NodeTypes

export type RegisteredNodeTypes = keyof typeof nodeComponents
