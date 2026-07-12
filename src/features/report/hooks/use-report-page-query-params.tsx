import useQueryParams from '@/hooks/use-query-params'
import { format } from 'date-fns'

export type PageQueryParams = {
	'date:eq': string
	'auto-refresh'?: number | false
}

export const useReportPageQueryParams = () => {
	return useQueryParams<PageQueryParams>({
		'date:eq': format(new Date(), 'yyyy-MM-dd')
	})
}
