import { z } from 'zod'

export enum FormActionEnum {
	IMPORT = 'A',
	EXPORT = 'B'
}

export const outboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z
		.string({
			required_error: 'ns_validation:required'
		})
		.trim()
		.min(1, { message: 'ns_validation:required' })
})

export const inboundSchema = outboundSchema.extend({
	warehouse_num: z.string().trim().min(1, { message: 'ns_validation:required' }),
	storage: z.string({ required_error: 'ns_validation:required' }).trim().min(1, { message: 'ns_validation:required' }),
	dept_code: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' }),
	dept_name: z
		.string({ required_error: 'ns_validation:required' })
		.trim()
		.min(1, { message: 'ns_validation:required' })
})

export type InboundFormValues = z.infer<typeof inboundSchema>
export type OutboundFormValues = z.infer<typeof outboundSchema>
export type FormValues = InboundFormValues | OutboundFormValues
export type InoutboundPayload = { mo_no: string } & FormValues
