import { z } from 'zod'

export enum FormActionEnum {
	IMPORT = 'A',
	EXPORT = 'B'
}

export const inboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z.string().default(undefined),
	warehouse_num: z.string().default(undefined),
	storage: z.string().default(undefined)
})

export const outboundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	rfid_use: z.string().default(undefined)
})

export type InboundFormValues = z.infer<typeof inboundSchema>
export type OutboundFormValues = z.infer<typeof outboundSchema>
