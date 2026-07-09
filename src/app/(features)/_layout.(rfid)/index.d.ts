import type { IElectronicProductCode } from '@/common/types/entities'

export type OrderItem = {
	mo_no: string
	color_sn: string
	factory_shoes_style: string
	factory_code_produce: string
	sizes: Array<{
		size_numcode: string
		count: number
	}>
}

export type RFIDStreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: Array<OrderItem>
	has_invalid?: boolean
}

export type SearchEpcParams = {
	'mo_no:eq': string
	'size_numcode:eq': string
}
