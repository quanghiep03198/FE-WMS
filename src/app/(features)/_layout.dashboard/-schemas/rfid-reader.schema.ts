import { RecordStatus } from '@/common/constants/enums'
import z from 'zod'

export const createRFIDReaderSchema = z.object({
	device_sn: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	station_no: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	ip_address: z.ipv4({ message: 'ns_validation:invalid_ipv4' }),
	ip_port: z
		.string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.regex(/^\d+$/, { message: 'ns_validation:invalid_value' }),
	device_ant: z.enum(['0', '1'], { message: 'ns_validation:required' }),
	is_active: z.enum(RecordStatus).optional()
})
export const updateRFIDReaderSchema = createRFIDReaderSchema.partial()

export type CreateRFIDReaderFormValues = z.infer<typeof createRFIDReaderSchema>
export type UpdateRFIDReaderFormValues = z.infer<typeof updateRFIDReaderSchema>
