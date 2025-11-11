export const NodeType = {
  INITIAL: 'INITIAL',
  MANUAL_TRIGGER: 'MANUAL_TRIGGER',
  HTTP_REQUEST: 'HTTP_REQUEST',
  GOOGLE_FORMS_TRIGGER: 'GOOGLE_FORMS_TRIGGER',
  STRIPE_TRIGGER: 'STRIPE_TRIGGER',
} as const

export type NodeType = (typeof NodeType)[keyof typeof NodeType]
