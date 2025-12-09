import useQueryParams from '@/common/hooks/use-query-params'

export type PageQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

export const useReportPageQueryParams = () => {
	return useQueryParams<PageQueryParams>()
}
