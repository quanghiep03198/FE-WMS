import { useMutation, useQuery } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { UpdateStorageLocationFormValue } from '../schemas/storage-location.schema'
import { StorageLocationService } from '../services/storage-location.service'
import { getOneWarehouseQueryOptions, WarehouseQueryKeys } from './use-warehouse-request'

export enum WarehouseStorageQueryKeys {
	WAREHOUSE_STORAGE = 'WAREHOUSE_STORAGE',
	WAREHOUSE_STORAGE_SUMMARY = 'WAREHOUSE_STORAGE_SUMMARY'
}

export function useGetWarehouseStorageSummaryQuery() {
	return useQuery({
		queryKey: [WarehouseStorageQueryKeys.WAREHOUSE_STORAGE_SUMMARY],
		queryFn: StorageLocationService.getWarehouseStorageSummary,
		select: (response) => response.metadata
	})
}

export function useGetStorageLocationByWarehouseQuery(warehouseName: string) {
	return useQuery(
		getOneWarehouseQueryOptions(warehouseName, (response) =>
			Array.isArray(response.metadata?.storage_locations)
				? response.metadata.storage_locations.sort((a, b) =>
						a.name.localeCompare(b.name, undefined, { numeric: true })
					)
				: []
		)
	)
}

export function useCreateStorageMutation(warehouseName: string) {
	const { t } = useTranslation()

	return useMutation({
		meta: {
			invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseName]]
		},
		mutationFn: StorageLocationService.createWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => toast.success(t('ns_common:notification.success'), { id: context }),
		onError: (error, _variables, context) => {
			if (error.response?.status !== HttpStatusCode.Conflict)
				toast.error(t('ns_common:notification.error'), { id: context })
			else toast.error((error.response?.data as ResponseBody<null>).message, { id: context })
		}
	})
}

export function useUpdateStorageMutation(warehouseName: string) {
	const { t } = useTranslation()

	return useMutation({
		meta: {
			invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseName]]
		},
		throwOnError: true,
		mutationFn: async ({ _id, ...payload }: UpdateStorageLocationFormValue) =>
			await StorageLocationService.updateWarehouseStorage(_id, payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => toast.success(t('ns_common:notification.success'), { id: context }),
		onError: (error, _variables, context) => {
			if (error.response?.status !== HttpStatusCode.Conflict)
				toast.error(t('ns_common:notification.error'), { id: context })
			else toast.error((error.response?.data as ResponseBody<null>).message, { id: context })
		}
	})
}

export function useDeleteStorageMutation(warehouseName: string) {
	const { t } = useTranslation()

	return useMutation({
		meta: {
			invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseName]]
		},
		mutationFn: StorageLocationService.deleteWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		}
	})
}
