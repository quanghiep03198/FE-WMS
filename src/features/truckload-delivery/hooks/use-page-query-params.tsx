import type { SortDirection } from '@tanstack/react-table'
import { format, isValid } from 'date-fns'
import { omitBy } from 'lodash-es'
import { useCallback } from 'react'
import { isDateRange } from 'react-day-picker'
import type { TruckloadDeliveryStatus } from '../constants'
import { usePageContext } from '../contexts/page-context'
import type { FilterOperator, TruckloadDeliveryFilterFormValues } from '../schemas'
import type { ITruckloadDelivery } from '../services/truckload-delivery.service'

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
} & Pick<Pagination<ITruckloadDelivery>, 'page' | 'limit'>

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
export const STORED_DELIVERY_PAGE_QUERY_KEY = 'deliverySearchParams'

export const usePageQueryParams = () => {
	const { searchParams, setParams } = usePageContext()
	return { searchParams, setParams }
}

export const useBuildQueryParams = () => {
	return useCallback((currentSearchParams: PageQueryParams, value: TruckloadDeliveryFilterFormValues) => {
		// * Extract non-filter params (not starting with 'where')
		const noneFilterParams = omitBy<Partial<PageQueryParams>>(currentSearchParams, (_value, key) =>
			key.startsWith('where')
		)

		// * Build filter params from the form values
		const filterParams = value.where.reduce<Record<string, string>>((acc, { column, operator, value }) => {
			if (!column) return acc

			let paramValue: string
			if (isDateRange(value)) {
				paramValue = operator
					.replace('@value1', format(value.from, 'yyyy-MM-dd'))
					.replace('@value2', format(value.to, 'yyyy-MM-dd'))
			} else if (typeof value === 'string' && operator === '=:@value' && isValid(new Date(value))) {
				paramValue = operator.replace('@value', format(value, 'yyyy-MM-dd'))
			} else {
				paramValue = operator.replace('@value', String(value ?? ''))
			}

			return {
				...acc,
				[`where.${column}`]: paramValue
			}
		}, {})

		return { ...noneFilterParams, ...filterParams } as PageQueryParams
	}, [])
}
