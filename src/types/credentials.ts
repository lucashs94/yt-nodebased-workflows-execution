export const CredentialType = {
  OPENAI: 'OPENAI',
  ANTHROPIC: 'ANTHROPIC',
  GEMINI: 'GEMINI',
} as const

export type CredentialType =
  (typeof CredentialType)[keyof typeof CredentialType]
