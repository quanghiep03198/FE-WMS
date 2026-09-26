import { enum as enums, ipv4, object, string, type infer as Infer } from 'zod'
import { RFIDDeviceType } from '../constants'

export const createRFIDReaderSchema = object({
	device_name: object({
		vi: string().optional(),
		en: string().optional(),
		cn: string().optional()
	}),
	device_sn: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	station_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	tcp_ip: ipv4({ message: 'ns_validation:invalid_ipv4' }),
	tcp_port: string({ message: 'ns_validation:required' })
		.nonempty({ message: 'ns_validation:required' })
		.regex(/^\d+$/, { message: 'ns_validation:invalid_value' }),
	device_type: enums(RFIDDeviceType, { message: 'ns_validation:required' })
})
export const updateRFIDReaderSchema = createRFIDReaderSchema.partial()

export type CreateRFIDReaderFormValues = Infer<typeof createRFIDReaderSchema>
export type UpdateRFIDReaderFormValues = Infer<typeof updateRFIDReaderSchema>
