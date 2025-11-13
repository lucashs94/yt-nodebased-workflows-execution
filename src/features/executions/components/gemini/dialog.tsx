'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCredentialsByType } from '@/features/credentials/hooks/useCredentials'
import { CredentialType } from '@/types/credentials'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const AVAILABLE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-8b',
  'gemini-2.0-pro',
  'gemini-2.0-pro',
  'gemini-pro',
] as const

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, 'Variable name is required')
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      'Variable name must start with letters or underscore and contain only letters, numbers and underscore'
    ),
  model: z.enum(AVAILABLE_MODELS),
  credentialId: z.string().min(1, 'Credential is required'),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, 'User prompt is required'),
})

export type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<FormValues>
}

export const ConfigDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.GEMINI)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || '',
      model: defaultValues.model || AVAILABLE_MODELS[0],
      credentialId: defaultValues.credentialId || '',
      systemPrompt: defaultValues.systemPrompt || '',
      userPrompt: defaultValues.userPrompt || '',
    },
  })

  const watchVaribaleName = form.watch('variableName') || 'myGemini'

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || '',
        model: defaultValues.model || AVAILABLE_MODELS[0],
        credentialId: defaultValues.credentialId || '',
        systemPrompt: defaultValues.systemPrompt || '',
        userPrompt: defaultValues.userPrompt || '',
      })
    }
  }, [open, defaultValues, form])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>

          <DialogDescription>
            Configure AI model and prompt for the Gemini node
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="myGemini"
                    />
                  </FormControl>

                  <FormDescription>
                    Use this name to reference the result in other nodes:{' '}
                    {`{{${watchVaribaleName}.text}}`}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem
                          key={model}
                          value={model}
                        >
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    The Google Gemini model to use for completion
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCredentials || !credentials?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem
                          key={credential.id}
                          value={credential.id}
                        >
                          <Image
                            src={'/logos/gemini.svg'}
                            alt={credential.name}
                            width={16}
                            height={16}
                          />

                          {credential.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    The credential to use AI api call
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Opcional)</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                      placeholder="You are a helpful assistant"
                    />
                  </FormControl>

                  <FormDescription>
                    Sets the behavior of the assistant. Use {'{{variable}}'}
                    for simple values or {'{{json variable}}'} to stringify
                    objects
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] font-mono text-sm"
                      placeholder="Summarize this text: {{json httpResponse.data}}"
                    />
                  </FormControl>

                  <FormDescription>
                    The prompt to send to the AI. Use {'{{variable}}'}
                    for simple values or {'{{json variable}}'} to stringify
                    objects
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
