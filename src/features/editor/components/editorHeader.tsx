'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from '@/features/workflows/hooks/useWorkflows'
import { useAtomValue } from 'jotai'
import { SaveIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { editorAtom } from '../store/atom'

export function EditorSaveBtn({ workflowId }: { workflowId: string }) {
  const editor = useAtomValue(editorAtom)
  const saveWorkflow = useUpdateWorkflow()

  const handleSave = () => {
    if (!editor) return

    const nodes = editor.getNodes()
    const edges = editor.getEdges()

    saveWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    })
  }

  return (
    <div className="ml-auto">
      <Button
        size={'sm'}
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  )
}

export function EditorNameInput({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId)
  const updateWorkflow = useUpdateWorkflowName()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(workflow.name)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (workflow.name) setName(workflow.name)
  }, [workflow.name])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false)
      return
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name,
      })
    } catch (error) {
      setName(workflow.name)
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    if (e.key === 'Escape') {
      setName(workflow.name)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        disabled={updateWorkflow.isPending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className="h-7 w-auto min-w-[100px] px-2"
      />
    )
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  )
}

export function EditorBreadcrumbs({ workflowId }: { workflowId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={`/workflows`}
              prefetch
            >
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />

      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveBtn workflowId={workflowId} />
      </div>
    </header>
  )
}
