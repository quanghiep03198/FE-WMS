import { SortDirection } from '@tanstack/react-table'
import { useSessionStorageState } from 'ahooks'
import { format, isValid } from 'date-fns'
import { omitBy } from 'lodash-es'
import { useCallback } from 'react'
import { isDateRange } from 'react-day-picker'
import { TruckloadDeliveryStatus } from '../-constants'
import { FilterOperator, TruckloadDeliveryFilterFormValues } from '../-schemas'
import { useStoreFilterParams } from './use-store-filter-params'
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

// export const _usePageQueryParams = () => {
// 	// * Set default pagination params if not present in URL
// 	const search = useRouterState({ select: (s) => s.location.search as PageQueryParams })

// 	search['page'] ??= 1
// 	search['limit'] ??= 20

// 	// * Get stored filter params from session storage
// 	const [storedFilterParams] = useStoreFilterParams()

// 	// * Build initial query params by merging URL params and stored filter params
// 	const buildQueryParams = useBuildQueryParams()
// 	const defaultParams = buildQueryParams(search, storedFilterParams)

// 	return useQueryParams<PageQueryParams>(defaultParams)
// }

export const STORED_DELIVERY_PAGE_QUERY_KEY = 'deliverySearchParams'

export const usePageQueryParams = () => {
	// * Get stored filter params from session storage
	const [storedFilterParams] = useStoreFilterParams()

	// * Build initial query params by merging URL params and stored filter params
	const buildQueryParams = useBuildQueryParams()
	const defaultParams = buildQueryParams({ page: 1, limit: 20 }, storedFilterParams)

	const [searchParams, setParams] = useSessionStorageState<PageQueryParams>(STORED_DELIVERY_PAGE_QUERY_KEY, {
		defaultValue: defaultParams,
		listenStorageChange: true
	})

	return {
		searchParams,
		setParams
	}
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
			} else if (isValid(value)) {
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
