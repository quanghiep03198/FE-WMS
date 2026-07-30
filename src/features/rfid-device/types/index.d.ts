import type { RecordStatus } from '@common/constants/enums'

export interface IRFIDReaderDevice {
	device_name_vi: string | null
	device_name_en: string | null
	device_name_cn: string | null
	station_no: string
	device_ant: string
	device_sn: string
	ip_address: string
	ip_port: string
	is_active: RecordStatus
	created: string | Date
	last_used_time: string | Date | null
}
