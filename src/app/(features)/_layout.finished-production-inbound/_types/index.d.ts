export type SearchCustOrderParams = {
	'mo_no.eq': string
	'mat_ecolor.eq': string
	'shoes_style_code_factory.eq'?: string
	q: string
}

export type FetchFPEpcParams = {
	_page: number
	'mo_no.eq': string
}

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
