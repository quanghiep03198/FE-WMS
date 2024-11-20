export type SearchCustOrderParams = {
	'mo_no.eq': string
	'mat_code.eq': string
	'size_num_code.eq'?: string
	q: string
}

export type FetchFPEpcParams = {
	page: number
	'mo_no.eq': string
}
