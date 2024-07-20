import { IWarehouseStorage } from '@/common/types/entities'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import {
	UseQueryOptions,
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PartialStorageFormValue } from '../_schemas/-warehouse.schema'

export const WAREHOUSE_STORAGE_PROVIDE_TAG = 'WAREHOUSE_STORAGE'

type TQueryKey = readonly [typeof WAREHOUSE_STORAGE_PROVIDE_TAG, string]

export function useGetWarehouseStorageQuery<TData = ResponseBody<IWarehouseStorage[]>>(
	warehouseNum: string,
	options: Partial<UseQueryOptions<ResponseBody<IWarehouseStorage[]>, AxiosError<unknown, any>, TData, TQueryKey>>
) {
	return useQuery({
		queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		refetchOnMount: 'always',
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

// Update warehouse storage location
export const useUpdateStorageMutation = ({ warehouseNum }: { warehouseNum: string }) => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		mutationFn: (data: { storageNum: string; payload: PartialStorageFormValue }) =>
			WarehouseStorageService.updateWarehouseStorage(data.storageNum, data.payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})
}

export const useDeleteStorageMutation = ({ warehouseNum }: { warehouseNum: string }, { onSettled }) => {}
