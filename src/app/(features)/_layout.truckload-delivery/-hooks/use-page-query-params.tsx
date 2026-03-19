import useQueryParams from '@/common/hooks/use-query-params'
import { TruckloadDeliveryStatus } from '../-constants'

export const usePageQueryParams = () => {
	return useQueryParams<
		{ from?: Date | string; to?: Date | string; status?: TruckloadDeliveryStatus } & Pick<
			Pagination,
			'page' | 'limit'
		>
	>({
		page: 1,
		limit: 20
	})
}
