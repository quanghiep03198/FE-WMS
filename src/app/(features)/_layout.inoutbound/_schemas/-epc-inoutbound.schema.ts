import { z } from 'zod'

export enum FormActionEnum {
	IMPORT = 'A',
	EXPORT = 'B'
}

export const inOutBoundSchema = z
	.object({
		rfid_status: z.nativeEnum(FormActionEnum),
		rfid_use: z.string({ required_error: 'This field is required' }),
		warehouse_num: z.string({ required_error: 'This field is required' }).optional(),
		storage: z.string({ required_error: 'This field is required' }).optional()
	})
	.refine((values) => {
		if (values.rfid_use === FormActionEnum.IMPORT) return values.warehouse_num && values.storage
		else return true
	})

export type InoutboundFormValues = z.infer<typeof inOutBoundSchema>
