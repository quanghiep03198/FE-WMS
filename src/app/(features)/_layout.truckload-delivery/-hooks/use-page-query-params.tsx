import useQueryParams from '@/common/hooks/use-query-params'
import { SortDirection } from '@tanstack/react-table'
import { TruckloadDeliveryStatus } from '../-constants'

type PageQueryParams = {
	'from.eq'?: Date | string
	'to.eq'?: Date | string
	'po.like'?: string
	'container.like'?: string
	'status.eq'?: TruckloadDeliveryStatus
	'sort.container_number': SortDirection
	'sort.license_plate'?: SortDirection
	'sort.outbound_qty'?: SortDirection
	'sort.created'?: SortDirection
	'sort.container_sealing_time'?: SortDirection
	'sort.factory_departure_time'?: SortDirection
	'sort.actual_departure_time'?: SortDirection
} & Pick<Pagination, 'page' | 'limit'>

export const usePageQueryParams = () => {
	return useQueryParams<PageQueryParams>({
		page: 1,
		limit: 20
	})
}
