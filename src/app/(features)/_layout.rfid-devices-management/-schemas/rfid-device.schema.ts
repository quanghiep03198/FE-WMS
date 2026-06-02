import { RecordStatus } from '@/common/constants/enums'
import { enum as enums, ipv4, object, string, type infer as Infer } from 'zod'

export const createRFIDReaderSchema = object({
	device_sn: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	station_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	ip_address: ipv4({ message: 'ns_validation:invalid_ipv4' }),
	ip_port: string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.regex(/^\d+$/, { message: 'ns_validation:invalid_value' }),
	device_ant: enums(['0', '1'], { message: 'ns_validation:required' }),
	is_active: enums(RecordStatus).optional(),
	device_name_vi: string().nullish(),
	device_name_en: string().nullish(),
	device_name_cn: string().nullish()
})
export const updateRFIDReaderSchema = createRFIDReaderSchema.partial()

export type CreateRFIDReaderFormValues = Infer<typeof createRFIDReaderSchema>
export type UpdateRFIDReaderFormValues = Infer<typeof updateRFIDReaderSchema>
