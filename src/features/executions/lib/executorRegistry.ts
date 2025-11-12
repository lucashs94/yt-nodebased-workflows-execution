import { googleFormsTriggerExecutor } from '@/features/triggers/components/googleFormsTrigger/executor'
import { manualTriggerExecutor } from '@/features/triggers/components/manualTrigger/executor'
import { stripeTriggerExecutor } from '@/features/triggers/components/stripe-trigger/executor'
import { NodeType } from '@/types/nodes'
import { anthropicExecutor } from '../components/anthropic/executor'
import { geminiExecutor } from '../components/gemini/executor'
import { httpRequestExecutor } from '../components/httpRequest/executor'
import { openAiExecutor } from '../components/openai/executor'
import { NodeExecutor } from '../types'

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORMS_TRIGGER]: googleFormsTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type]

  if (!executor) throw new Error(`Executor not found for: ${type}`)

  return executor
}
