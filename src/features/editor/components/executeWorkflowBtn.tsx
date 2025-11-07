import { Button } from '@/components/ui/button'
import { useExecuteWorkflow } from '@/features/workflows/hooks/useWorkflows'
import { FlaskConicalIcon } from 'lucide-react'

export function ExecuteWorkflowBtn({ workflowId }: { workflowId: string }) {
  const executeWorkflow = useExecuteWorkflow()

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId })
  }

  return (
    <Button
      size={'lg'}
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon />
      Execute Workflow
    </Button>
  )
}
