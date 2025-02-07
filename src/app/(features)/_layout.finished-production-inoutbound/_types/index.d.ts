export type SearchCustOrderParams = {
	'mo_no.eq': string
	'mat_code.eq': string
	'size_numcode.eq'?: string
	q: string
}

export type FetchFPEpcParams = {
	_page: number
	'mo_no.eq': string
}

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined

export type OrderItem = {
	mo_no: string
	mat_code: string
	shoes_style_code_factory: string
	sizes: Array<{
		size_numcode: string
		count: number
	}>
}

export type RFIDStreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: Array<OrderItem>
}
