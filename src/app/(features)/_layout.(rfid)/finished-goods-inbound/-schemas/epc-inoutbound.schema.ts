import { z } from 'zod'
import { FormActionEnum, FormActionReasonEnum } from '../-constants'

export const outboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z.nativeEnum(FormActionReasonEnum),
	default_tenant: z.string(),
	target_tenant: z.string().nullable().optional()
})

export const inboundSchema = outboundSchema.extend({
	warehouse_num: z.string().trim().nonempty({ message: 'ns_validation:required' }),
	storage: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_code: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_name: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
})

export type InboundFormValues = z.infer<typeof inboundSchema>
export type OutboundFormValues = z.infer<typeof outboundSchema>
export type FormValues = InboundFormValues | OutboundFormValues
export type InoutboundPayload = { mo_no: string } & FormValues
