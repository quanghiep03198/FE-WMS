import { CommonActions } from '@common/constants/enums'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import type { CreateWarehouseFormValue, UpdateWarehouseFormValue } from '../schemas/warehouse.schema'
import { WarehouseService } from '../services/warehouse.service'
import type { IWarehouse } from '../types'

export enum WarehouseQueryKeys {
	WAREHOUSE = 'WAREHOUSE',
	WAREHOUSE_STORAGE_SUMMARY = 'WAREHOUSE_STORAGE_SUMMARY'
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
	const mutationHandlers: MutationHandlerMap = {
		[CommonActions.CREATE]: WarehouseService.create,
		[CommonActions.UPDATE]: WarehouseService.update,
		['none']: (...args: any[]) => Promise.resolve(args)
	}

	const handler = mutationHandlers[action]

	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE]] },
		mutationFn: (payload: CreateWarehouseFormValue & UpdateWarehouseFormValue) => handler(payload)
	})
}

export function useDeleteWarehouseMutation(settledHandler: () => void) {
	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE]] },
		mutationFn: WarehouseService.delete,
		onSettled: settledHandler
	})
}

export function useGetWarehouseStorageSummaryQuery() {
	return useQuery({
		queryKey: [WarehouseQueryKeys.WAREHOUSE_STORAGE_SUMMARY],
		queryFn: WarehouseService.getSummary,
		select: (response) => response.metadata
	})
}
