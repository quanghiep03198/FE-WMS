import { IElectronicProductCode } from '@/common/types/entities'

export type OrderItem = {
	mo_no: string
	mat_ecolor: string
	shoes_style_code_factory: string
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
	'mo_no.eq': string
	'size_numcode.eq': string
}
