import { IWarehouseStorage } from '@/common/types/entities'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationOptions,
	type UseQueryOptions
} from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PartialStorageFormValue } from '../_schemas/warehouse.schema'

export const WAREHOUSE_STORAGE_PROVIDE_TAG = 'WAREHOUSE_STORAGE'

type TQueryKey = ['WAREHOUSE_STORAGE', string]

type TransformResponseFn<T> = UseQueryOptions<
	ResponseBody<IWarehouseStorage[]>,
	AxiosError<unknown, any>,
	T,
	TQueryKey
>['select']

type TQueryFnData = Awaited<Promise<ResponseBody<IWarehouseStorage[]>>>

type UseGetWarehouseStorageQueryOptions<T> = UseQueryOptions<
	TQueryFnData,
	AxiosError<unknown, any>,
	ReturnType<TransformResponseFn<T>>,
	TQueryKey
>

export function getWarehouseStorageOptions<T>(
	warehouseNum: string,
	options?: Partial<UseGetWarehouseStorageQueryOptions<T>>
) {
	return {
		queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		placeholderData: keepPreviousData,
		...options
	} as Required<UseGetWarehouseStorageQueryOptions<T>>
}

export function useGetWarehouseStorageQuery<T>(
	warehouseNum: string,
	options?: Partial<UseGetWarehouseStorageQueryOptions<T>>
) {
	const defaultOptions = getWarehouseStorageOptions<T>(warehouseNum)

	const queryOptions = {
		...defaultOptions,
		...options
	}

	return useQuery(queryOptions)
}

export function useUpdateStorageMutation({ warehouseNum }: { warehouseNum: string }) {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		mutationFn: (data: { id: string; payload: PartialStorageFormValue }) =>
			WarehouseStorageService.updateWarehouseStorage(data.id, data.payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})
}

export function useDeleteStorageMutation(
	{ warehouseNum }: { warehouseNum: string },
	{
		onSettled
	}: UseMutationOptions<
		AxiosResponse<ResponseBody<null>, unknown>,
		AxiosError<unknown, unknown>,
		unknown,
		string | number
	>
) {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		mutationFn: WarehouseStorageService.deleteWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum] })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		},
		onSettled: onSettled
	})
}
