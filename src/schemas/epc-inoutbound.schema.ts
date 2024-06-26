import { CommonActions } from '@/common/constants/enums'
import { z } from 'zod'

export enum FormActionEnum {
	IMPORT = 'A',
	EXPORT = 'B'
}

export const inOutBoundSchema = z.object({
	rfid_status: z.nativeEnum(FormActionEnum),
	warehouse_num: z.string().optional(),
	rfid_use: z.string({ required_error: 'This field is required' }),
	storage: z.string({ required_error: 'This field is required' })
})

export type InOutBoundFormValues = z.infer<typeof inOutBoundSchema>
