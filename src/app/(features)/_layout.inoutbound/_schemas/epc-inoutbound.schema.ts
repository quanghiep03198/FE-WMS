import { z } from 'zod'

export enum FormActionEnum {
	IMPORT = 'A',
	EXPORT = 'B'
}

export const inboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z.string({ required_error: 'This field is required' }),
	warehouse_num: z.string({ required_error: 'This field is required' }),
	storage: z.string({ required_error: 'This field is required' }),
	dept_code: z.string({ required_error: 'This field is required' })
})

export const outboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z.string({ required_error: 'This field is required' })
})

export type InboundFormValues = z.infer<typeof inboundSchema>
export type OutboundFormValues = z.infer<typeof outboundSchema>
