import { IWarehouse } from '@/common/types/entities'
import { WarehouseService } from '@/services/warehouse.service'
import { UseQueryOptions, keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const WAREHOUSE_PROVIDE_TAG = 'WAREHOUSES' as const

export function useGetWarehouseQuery<TData = ResponseBody<IWarehouse[]>>(
	options: Partial<
		UseQueryOptions<ResponseBody<IWarehouse[]>, AxiosError<unknown, any>, TData, readonly ['WAREHOUSES']>
	>
) {
	return useQuery({
		queryKey: [WAREHOUSE_PROVIDE_TAG],
		queryFn: WarehouseService.getWarehouseList,
		placeholderData: keepPreviousData,
		...options
	})
}

// export const useUpsertWarehouseMutation = ({
// 	type, defaultFormValues, callback
// }: {callback?: () => void}) => {
// 	const queryClient = useQueryClient()

// 	const { t } = useTranslation()

// 	return useMutation({
// 		mutationKey: [WAREHOUSE_PROVIDE_TAG],
// 		mutationFn: (payload: FormValues<typeof type>) => {
// 			switch (type) {
// 				case CommonActions.CREATE: {
// 					return WarehouseService.createWarehouse(payload)
// 				}
// 				case CommonActions.UPDATE: {
// 					const id = defaultFormValues.id
// 					return WarehouseService.updateWarehouse({ id, payload })
// 				}
// 				default: {
// 					throw new Error('Invalid actions')
// 				}
// 			}
// 		},
// 		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
// 		onSuccess: (_data, _variables, context) => {

// 			queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
// 			if (typeof callback === 'function') callback()
// 			return toast.success(t('ns_common:notification.success'), { id: context })
// 		},
// 		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
// 	})
// }

export const useUpdateWarehouseStatusMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [WAREHOUSE_PROVIDE_TAG],
		mutationFn: WarehouseService.updateWarehouse,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useDeleteWarehouseMutation = (settledHandler: () => void) => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [WAREHOUSE_PROVIDE_TAG],
		mutationFn: WarehouseService.deleteWarehouse,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context }),
		onSettled: settledHandler
	})
}
