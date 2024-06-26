import { IWarehouse } from '@/common/types/entities'
import { WarehouseService } from '@/services/warehouse.service'
import { UseQueryOptions, keepPreviousData, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const WAREHOUSE_PROVIDE_TAG = 'WAREHOUSES' as const

const QUERY_KEY = [WAREHOUSE_PROVIDE_TAG] as const

type TQueryKey = typeof QUERY_KEY

export function useGetWarehouseQuery<TData = ResponseBody<IWarehouse[]>>(
	options: Partial<UseQueryOptions<ResponseBody<IWarehouse[]>, AxiosError<unknown, any>, TData, TQueryKey>>
) {
	return useQuery({
		queryKey: QUERY_KEY,
		queryFn: WarehouseService.getWarehouseList,
		placeholderData: keepPreviousData,
		...options
	})
}
