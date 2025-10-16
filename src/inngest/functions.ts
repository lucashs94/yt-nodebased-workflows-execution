import { inngest } from '@/inngest/client'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const google = createGoogleGenerativeAI()
const openAI = createOpenAI()
const anthropic = createAnthropic()

export const execute = inngest.createFunction(
  {
    id: 'execute-ai',
  },
  {
    event: 'execute/ai',
  },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
      model: google('gemini-1.5-flash'),
      system: 'You are a helpful assistant.',
      prompt: 'Whats is 2+7?',
    })

    return steps
  }
)
