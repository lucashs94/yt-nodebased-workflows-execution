import { NodeExecutor } from '@/features/executions/types'
import { NonRetriableError } from 'inngest'
import ky, { Options as KyOptions } from 'ky'

type HttpRequestData = {
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

  const result = await step.run('http-request', async () => {
    const method = data.method || 'GET'
    const endpoint = data.endpoint!

    const options: KyOptions = { method }

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body) {
        options.body = data.body
      }
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get('content-type')
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text()

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    }
  })

  // TODO: Publish "success" state to this node

  return result
}
