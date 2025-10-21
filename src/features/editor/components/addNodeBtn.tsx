'use client'

import { NodeSelector } from '@/components/nodeSelector'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { memo, useState } from 'react'

export const AddNodeBtn = memo(() => {
  const [open, setOpen] = useState(false)

  return (
    <NodeSelector
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        onClick={() => {}}
        size={'icon'}
        variant={'outline'}
        className="bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  )
})

AddNodeBtn.displayName = 'AddNodeBtn'
