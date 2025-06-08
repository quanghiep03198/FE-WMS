export type OrderItem = {
	mo_no: string
	color_sn: string
	shoes_style_code_factory: string
	factory_code_produce: string
	sizes: Array<{
		size_numcode: string
		count: number
	}>
}

export type SearchOutboundEpcParams = {
	'mo_no.eq': string
	'size_numcode.eq': string
}

export type FilterArchivedEpcParams = {
	_page: number
	q: string
	'shoes_style_code_factory.eq': string
	'color_sn.eq': string
	'mo_no.eq': string
	'size_numcode.eq': string
}
