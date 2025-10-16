'use client'
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'

export default function Page() {
  // await requireAuth()
  const trpc = useTRPC()
  const testAI = useMutation(trpc.testAI.mutationOptions())

  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-6 items-center justify-center">
      protected server comp.
      <Button
        onClick={() => testAI.mutate()}
        disabled={testAI.isPending}
      >
        Test AI
      </Button>
    </div>
  )
}
