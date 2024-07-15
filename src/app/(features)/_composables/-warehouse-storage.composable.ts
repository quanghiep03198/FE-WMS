import { IWarehouseStorage } from '@/common/types/entities'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { UseQueryOptions, keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const WAREHOUSE_STORAGE_PROVIDE_TAG = 'WAREHOUSE_STORAGE'

type TQueryKey = readonly [typeof WAREHOUSE_STORAGE_PROVIDE_TAG, string]

export function useGetWarehouseStorageQuery<TData = ResponseBody<IWarehouseStorage[]>>(
	warehouseNum: string,
	options: Partial<UseQueryOptions<ResponseBody<IWarehouseStorage[]>, AxiosError<unknown, any>, TData, TQueryKey>>
) {
	return useQuery({
		queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		placeholderData: keepPreviousData,
		...options
	})
}

export const getWarehouseStorageQueryOptions = (warehouseNum: string) =>
	queryOptions({
		queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		placeholderData: keepPreviousData,
		select: (response) =>
			Array.isArray(response.metadata)
				? response.metadata.map((item) => ({ label: item.storage_name, value: item.storage_num }))
				: []
	})
