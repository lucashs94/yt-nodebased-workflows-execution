'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
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
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import { CredentialType } from '@/types/credentials'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from '../hooks/useCredentials'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(CredentialType),
  value: z.string().min(1, 'Value is required'),
})

export type FormValues = z.infer<typeof formSchema>

const TypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: 'OpenAI',
    logo: '/logos/openai.svg',
  },
  {
    value: CredentialType.GEMINI,
    label: 'Gemini',
    logo: '/logos/gemini.svg',
  },
  {
    value: CredentialType.ANTHROPIC,
    label: 'Anthropic',
    logo: '/logos/anthropic.svg',
  },
]

interface CredentialFormProps {
  initialData?: {
    id?: string
    name: string
    type: CredentialType
    value: string
  }
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter()
  const createCredential = useCreateCredential()
  const updateCredential = useUpdateCredential()
  const { handleError, upgradeModal } = useUpgradeModal()

  const isEdit = !!initialData?.id

  const form = useForm<FormValues>({
    defaultValues: initialData || {
      name: '',
      type: CredentialType.OPENAI,
      value: '',
    },
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync(
        {
          id: initialData.id,
          ...values,
        },
        {
          onSuccess: () => {
            router.push(`/credentials`)
          },
        }
      )
    } else {
      await createCredential.mutateAsync(values, {
        onError: (error) => handleError(error),
        onSuccess: () => {
          router.push(`/credentials`)
        },
      })
    }
  }

  return (
    <>
      {upgradeModal}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? 'Edit Credential' : 'Create Credential'}
          </CardTitle>

          <CardDescription>
            {isEdit
              ? 'Update your API KEY or credential details'
              : 'Add a new API KEY or credential to your account'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="my API KEY"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {TypeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            <div className="flex items-center gap-2">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={16}
                                height={16}
                              />

                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API KEY</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="sk-..."
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    createCredential.isPending || updateCredential.isPending
                  }
                >
                  {isEdit ? 'Update' : 'Create'}
                </Button>

                <Button
                  variant={'outline'}
                  type="button"
                  asChild
                >
                  <Link
                    href="/credentials"
                    prefetch
                  >
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const {
    data: { id, name, type, value },
  } = useSuspenseCredential(credentialId)

  return (
    <CredentialForm
      initialData={{ id, name, type: type as CredentialType, value }}
    />
  )
}
