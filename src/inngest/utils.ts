import { Connection, Node } from '@/generated/prisma'
import toposort from 'toposort'
import { inngest } from './client'

export function topologicalSort(
  nodes: Node[],
  connections: Connection[]
): Node[] {
  // No connections, independent nodes
  if (connections.length === 0) return nodes

  // edges array for toposort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ])

  // Add nodes with no connections as self-edges to ensure they are included
  const connectedNodeIds = new Set<string>()
  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId)
    connectedNodeIds.add(conn.toNodeId)
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id])
    }
  }

  // Perform topological sort
  let sortedNodeIds: string[]
  try {
    sortedNodeIds = toposort(edges)

    // remove duplicates
    sortedNodeIds = [...new Set(sortedNodeIds)]
  } catch (err) {
    if (err instanceof Error && err.message.includes('Cyclic')) {
      throw new Error('Workflow contains a cycle')
    }

    throw err
  }

  // Map sorted IDs back to node objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean)
}

export const sendWorkflowExecution = async (data: {
  workflowId: string
  [key: string]: any
}) => {
  return inngest.send({
    name: 'workflows/execute.workflow',
    data,
  })
}
