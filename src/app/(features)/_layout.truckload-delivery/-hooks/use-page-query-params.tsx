import useQueryParams from '@/common/hooks/use-query-params'
import { SortDirection } from '@tanstack/react-table'
import { TruckloadDeliveryStatus } from '../-constants'
import { FilterOperator } from '../-schemas'
import { TruckloadDeliveryQueryData } from './use-truckload-delivery-asm'

export type PageQueryParams = {
	q?: string
	from?: Date | string
	to?: Date | string
	approval_status?: TruckloadDeliveryStatus
	'sort.container_number'?: SortDirection
	'sort.license_plate'?: SortDirection
	'sort.total_outbound_qty'?: SortDirection
	'sort.created_at'?: SortDirection
	'sort.container_sealing_time'?: SortDirection
	'sort.factory_departure_time'?: SortDirection
	'sort.actual_departure_time'?: SortDirection
	'where.license_plate'?: FilterOperator
	'where.container_number'?: FilterOperator
	'where.po'?: FilterOperator
} & Pick<Pagination<TruckloadDeliveryQueryData>, 'page' | 'limit'>

export type FlattenedPageQueryParams = {
	q?: string
	from?: Date | string
	to?: Date | string
	approval_status?: TruckloadDeliveryStatus
	sort: {
		container_number?: SortDirection
		license_plate?: SortDirection
		total_outbound_qty?: SortDirection
		created_at?: SortDirection
		container_sealing_time?: SortDirection
		factory_departure_time?: SortDirection
		actual_departure_time?: SortDirection
	}
	page: number
	limit: number
}

export const usePageQueryParams = () => {
	return useQueryParams<PageQueryParams>({
		page: 1,
		limit: 20
	})
}
