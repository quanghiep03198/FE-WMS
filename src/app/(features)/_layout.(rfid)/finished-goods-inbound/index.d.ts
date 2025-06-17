export type SearchCustOrderParams = {
	'mo_no.eq': string
	'color_sn.eq': string
	'shoes_style_code_factory.eq'?: string
	q: string
}

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
