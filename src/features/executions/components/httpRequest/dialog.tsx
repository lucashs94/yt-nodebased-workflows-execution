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
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, 'Variable name is required')
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      'Variable name must start with letters or underscore and contain only letters, numbers and underscore'
    ),
  endpoint: z.url({ message: 'Please enter a valid URL' }),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  body: z.string().optional(),
})

export type HttpRequestFormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: HttpRequestFormValues) => void
  defaultValues?: Partial<HttpRequestFormValues>
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || '',
      endpoint: defaultValues.endpoint || '',
      method: defaultValues.method || 'GET',
      body: defaultValues.body || '',
    },
  })

  const watchVaribaleName = form.watch('variableName') || 'myApiCall'
  const watchMethod = form.watch('method')
  const isBodyRequired = ['POST', 'PUT', 'PATCH'].includes(watchMethod)

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || '',
        endpoint: defaultValues.endpoint || '',
        method: defaultValues.method || 'GET',
        body: defaultValues.body || '',
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
          <DialogTitle>HTTP Request</DialogTitle>

          <DialogDescription>
            Configure settings for the HTTP request node
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
                      placeholder="myApiCall"
                    />
                  </FormControl>

                  <FormDescription>
                    Use this name to reference the result in other nodes:{' '}
                    {`{{${watchVaribaleName}.httpResponse.data}}`}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    The HTTP method to use for this request
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                    />
                  </FormControl>

                  <FormDescription>
                    Static URL or use {'{{variables}}'} for simple values or{' '}
                    {'{{json variable}}'} to stringify objects
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {isBodyRequired && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                        placeholder={
                          '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                        }
                      />
                    </FormControl>

                    <FormDescription>
                      JSON with template variables. Use {'{{variables}}'} for
                      simple values or {'{{json variable}}'} to stringify
                      objects
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
