import { CommonActions } from '@common/constants/enums'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { CreateWarehouseFormValue, UpdateWarehouseFormValue } from '../schemas/warehouse.schema'
import { WarehouseService } from '../services/warehouse.service'
import type { IWarehouse } from '../types'

export enum WarehouseQueryKeys {
	WAREHOUSE = 'WAREHOUSE'
}

export function getOneWarehouseQueryOptions(
	warehouseName: string,
	select?: (response: ResponseBody<Required<IWarehouse>>) => any
) {
	return queryOptions({
		queryKey: [WarehouseQueryKeys.WAREHOUSE, warehouseName],
		queryFn: () => WarehouseService.getOne(warehouseName),
		enabled: Boolean(warehouseName),
		select: typeof select === 'function' ? select : (response) => response.metadata
	})
}

export function useGetWarehouseQuery() {
	return useQuery({
		queryKey: [WarehouseQueryKeys.WAREHOUSE],
		queryFn: WarehouseService.getAll,
		select: (response) => response.metadata ?? []
	})
}

export const useGetOneWarehouseQuery = (name: string) => {
	return useQuery(getOneWarehouseQueryOptions(name))
}

type MutationHandlerMap = {
	[CommonActions.CREATE]: (payload: CreateWarehouseFormValue) => Promise<ResponseBody<unknown>>
	[CommonActions.UPDATE]: (payload: UpdateWarehouseFormValue) => Promise<ResponseBody<unknown>>
	['none']: () => Promise<unknown>
}

export const useCreateOrUpdateWarehouseMutation = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const mutationHandlers: MutationHandlerMap = {
		[CommonActions.CREATE]: WarehouseService.create,
		[CommonActions.UPDATE]: WarehouseService.update,
		['none']: (...args: any[]) => Promise.resolve(args)
	}

	const handler = mutationHandlers[action]

	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE]] },
		mutationFn: (payload: CreateWarehouseFormValue & UpdateWarehouseFormValue) => handler(payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WarehouseQueryKeys.WAREHOUSE] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})
}

export function useDeleteWarehouseMutation(settledHandler: () => void) {
	const queryClient = useQueryClient()
	const { t } = useTranslation()

	return useMutation({
		mutationKey: [WarehouseQueryKeys.WAREHOUSE],
		mutationFn: WarehouseService.delete,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WarehouseQueryKeys.WAREHOUSE] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context }),
		onSettled: settledHandler
	})
}
