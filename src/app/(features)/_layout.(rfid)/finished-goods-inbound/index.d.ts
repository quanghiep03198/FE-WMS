export type SearchCustOrderParams = {
	'mo_no:eq': string
	'color_sn:eq': string
	'factory_shoes_style:eq'?: string
	q: string
}

export type ScanningStatus = 'connecting' | 'connected' | 'disconnected' | undefined
