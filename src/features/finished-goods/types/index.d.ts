export interface IElectronicProductCode {
	epc: string
	mo_no: string
	factory_shoes_style?: string
	color_sn?: string
	size_numcode?: string
	factory_code_produce?: string
	station_no?: string
	scannable?: boolean
}

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

export type FinishedGoodsStockFlow = 'inbound' | 'outbound'

export type SearchEpcParams = {
	'mo_no:eq': string
	'size_numcode:eq': string
}

export type SearchCustOrderParams = {
	'mo_no:eq': string
	'color_sn:eq': string
	'factory_shoes_style:eq'?: string
	q: string
}

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined

export type FilterDeletedEpcParams = {
	_page: number
	_limit: number
	q: string
	'shoes_style:eq': string
	'color_sn:eq': string
	'mo_no:eq': string
	'size_numcode:eq': string
	'scanned:eq'?: boolean
	'scannable:eq'?: boolean
}
