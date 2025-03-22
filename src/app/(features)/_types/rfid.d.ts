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
}
