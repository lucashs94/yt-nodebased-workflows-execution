'use client'

import { ErrorView, LoadingView } from '@/components/entityComponents'
import { useSuspenseWorkflow } from '@/features/workflows/hooks/useWorkflows'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Panel,
  ReactFlow,
} from '@xyflow/react'
import { useCallback, useState } from 'react'

import { nodeComponents } from '@/config/nodeComponents'
import '@xyflow/react/dist/style.css'
import { useSetAtom } from 'jotai'
import { editorAtom } from '../store/atom'
import { AddNodeBtn } from './addNodeBtn'

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />
}

export const EditorError = () => {
  return <ErrorView message="Error loading editor..." />
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId)

  const setEditorInstance = useSetAtom(editorAtom)

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes)
  const [edges, setEdges] = useState<Edge[]>(workflow.edges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeComponents}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditorInstance}
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        snapToGrid
        snapGrid={[10, 10]}
        // panOnScroll
        // panOnDrag={false}
        // selectionOnDrag
      >
        <Background />
        <Controls />

        <Panel position="top-right">
          <AddNodeBtn />
        </Panel>
      </ReactFlow>
    </div>
  )
}
