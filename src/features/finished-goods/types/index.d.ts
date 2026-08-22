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
export interface IArchivedFilterFeature {
	factory_shoes_style: string
	colorways: Array<{
		color_sn: string
		batches: Array<{
			mo_no: string
			sizes: Array<string>
		}>
	}>
}

export type StockTransactionType = 'stock_in' | 'recall' | 'stock_out'

export interface IStockTransaction<T extends StockFlow> {
	id: string
	mo_no: string
	po: T extends 'outbound' ? string : never
	qty: number
	tx_at: string
	tx_type: StockTransactionType
	detail: Record<
		string,
		{
			stocked_in_qty: number
			total_recall_tx: number
			total_return_tx: number
			shipped_out_qty: number
		}
	>
}
