import type { RecordStatus } from '@common/constants/enums'

export interface IRFIDReaderDevice {
	device_name: Partial<{ vi: string; en: string; cn: string }>
	station_no: string
	device_ant: string
	device_sn: string
	tcp_ip: string
	tcp_port: string
	is_active: RecordStatus
	created: string | Date
	last_used_time: string | Date | null
	deleted?: boolean
}
