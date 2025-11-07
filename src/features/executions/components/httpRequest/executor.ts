import { NodeExecutor } from '@/features/executions/types'
import { NonRetriableError } from 'inngest'
import ky, { Options as KyOptions } from 'ky'

type HttpRequestData = {
  variableName?: string
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
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
    throw new NonRetriableError(`Variable name not configured`)
  }

  const result = await step.run('http-request', async () => {
    const method = data.method || 'GET'
    const endpoint = data.endpoint!

    const options: KyOptions = { method }

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body) {
        options.body = data.body
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

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      }
    }

    // Fallback for backward compatibility
    return {
      ...context,
      ...responsePayload,
    }
  })

  // TODO: Publish "success" state to this node

  return result
}
