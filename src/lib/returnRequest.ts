export type RefundChoice = 'yes' | 'no'

export interface ReturnApiPayload {
  orderId: string
  reason: string
  refund: RefundChoice
  replacement: RefundChoice
  condition: string
  comment: string
  carrier: string
  trakingNumber: string
  quantity: number
}

export interface ReturnApiValidationResult {
  isValid: boolean
  errors: Partial<Record<keyof ReturnApiPayload, string>>
}

interface BuildReturnPayloadInput {
  orderId: string
  reason: string
  resolutionType: 'refund' | 'replacement'
  condition: string
  comment: string
  carrier: string
  trackingNumber: string
  quantity: number
}

export const buildReturnPayload = (input: BuildReturnPayloadInput): ReturnApiPayload => {
  const isRefund = input.resolutionType === 'refund'

  return {
    orderId: input.orderId.trim(),
    reason: input.reason.trim(),
    refund: isRefund ? 'yes' : 'no',
    replacement: isRefund ? 'no' : 'yes',
    condition: input.condition.trim(),
    comment: input.comment.trim(),
    carrier: input.carrier.trim(),
    // API contract uses `trakingNumber`.
    trakingNumber: input.trackingNumber.trim(),
    quantity: input.quantity,
  }
}

export const validateReturnPayload = (payload: ReturnApiPayload): ReturnApiValidationResult => {
  const errors: Partial<Record<keyof ReturnApiPayload, string>> = {}

  if (!payload.orderId) {
    errors.orderId = 'Order id is required.'
  }

  if (!payload.reason) {
    errors.reason = 'Reason is required.'
  }

  if (payload.refund === payload.replacement) {
    errors.refund = 'Refund and replacement values are invalid.'
    errors.replacement = 'Refund and replacement values are invalid.'
  }

  if (!payload.condition) {
    errors.condition = 'Condition is required.'
  }

  if (!payload.comment) {
    errors.comment = 'Comment is required.'
  }

  if (!payload.carrier) {
    errors.carrier = 'Carrier is required.'
  }

  if (!payload.trakingNumber) {
    errors.trakingNumber = 'Tracking number is required.'
  }

  if (!Number.isFinite(payload.quantity) || payload.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
