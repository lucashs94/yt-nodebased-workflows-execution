import { NodeExecutor } from '@/features/executions/types'
import { statusChannel } from '@/inngest/channels/statusChannel'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import Handlebars from 'handlebars'
import { NonRetriableError } from 'inngest'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type OpenAiData = {
  variableName?: string
  model?: string
  systemPrompt?: string
  userPrompt?: string
}

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  context,
  data,
  nodeId,
  step,
  publish,
}) => {
  await publish(
    statusChannel().status({
      nodeId,
      status: 'loading',
    })
  )

  if (!data.variableName || !data.userPrompt) {
    await publish(
      statusChannel().status({
        nodeId,
        status: 'error',
      })
    )

    throw new NonRetriableError(
      'OpenAI node: Variable name or userPrompt is missing'
    )
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : 'You are a helpful assistant.'
  const userPrompt = Handlebars.compile(data.userPrompt)(context)

  //  TOO: add credential request

  const apiKey = process.env.OPENAI_API_KEY!

  const ai = createOpenAI({
    apiKey,
  })

  try {
    const { steps } = await step.ai.wrap('openai-generate-text', generateText, {
      model: ai(data.model || 'gpt-3.5-turbo'),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    })

    const text =
      steps[0].content[0].type === 'text' ? steps[0].content[0].text : ''

    await publish(
      statusChannel().status({
        nodeId,
        status: 'success',
      })
    )

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    }
  } catch (error) {
    await publish(
      statusChannel().status({
        nodeId,
        status: 'error',
      })
    )
    throw error
  }
}
