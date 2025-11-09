import { NodeExecutor } from '@/features/executions/types'
import Handlebars from 'handlebars'
import { NonRetriableError } from 'inngest'
import ky, { Options as KyOptions } from 'ky'

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  return new Handlebars.SafeString(jsonString)
})

type HttpRequestData = {
  variableName: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  context,
  data,
  nodeId,
  step,
}) => {
  // TODO: Publish "loading" state to this node

  if (!data.endpoint) {
    // TODO: Publish "error" state to the node
    throw new NonRetriableError(`HTTP Request node: No endpoint configured`)
  }

  if (!data.variableName) {
    // TODO: Publish "error" state to the node
    throw new NonRetriableError(
      `HTTP Request node: Variable name not configured`
    )
  }

  if (!data.method) {
    // TODO: Publish "error" state to the node
    throw new NonRetriableError(`HTTP Request node: Method not configured`)
  }

  const result = await step.run('http-request', async () => {
    const method = data.method
    const endpoint = Handlebars.compile(data.endpoint)(context)

    const options: KyOptions = { method }

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body) {
        const resolved = Handlebars.compile(data.body || '{}')(context)
        JSON.parse(resolved)

        options.body = resolved
        options.headers = {
          'Content-Type': 'application/json',
        }
      }
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get('content-type')
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    }

    return {
      ...context,
      [data.variableName]: responsePayload,
    }
  })

  // TODO: Publish "success" state to this node

  return result
}
