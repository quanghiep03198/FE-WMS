import { enum as enums, object, string, type infer as Infer } from 'zod'
import { FormActionEnum, FormActionReasonEnum } from '../-constants'

export const outboundSchema = object({
	rfid_status: enums(FormActionEnum),
	rfid_use: enums(FormActionReasonEnum)
})

export const inboundSchema = outboundSchema.extend({
	warehouse_num: string().trim().nonempty({ message: 'ns_validation:required' }),
	storage: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
})

export type InboundFormValues = Infer<typeof inboundSchema>
export type OutboundFormValues = Infer<typeof outboundSchema>
export type FormValues = InboundFormValues | OutboundFormValues
export type InoutboundPayload = { mo_no: string } & FormValues
