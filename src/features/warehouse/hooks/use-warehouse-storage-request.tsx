import { useMutation, useQuery } from '@tanstack/react-query'
import type { UpdateStorageLocationFormValue } from '../schemas/storage-location.schema'
import { StorageLocationService } from '../services/storage-location.service'
import { getOneWarehouseQueryOptions, WarehouseQueryKeys } from './use-warehouse-request'

export enum WarehouseStorageQueryKeys {
	WAREHOUSE_STORAGE = 'WAREHOUSE_STORAGE'
}

export function useGetStorageLocationByWarehouseQuery(warehouseId: string) {
	return useQuery(
		getOneWarehouseQueryOptions(warehouseId, (response) =>
			Array.isArray(response.metadata?.storage_locations)
				? response.metadata.storage_locations.sort((a, b) =>
						a.name.localeCompare(b.name, undefined, { numeric: true })
					)
				: []
		)
	)
}

export function useCreateStorageMutation(warehouseId: string) {
	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseId]] },
		mutationFn: StorageLocationService.createWarehouseStorage
	})
}

export function useUpdateStorageMutation(warehouseId: string) {
	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseId]] },
		throwOnError: true,
		mutationFn: async ({ _id, ...payload }: UpdateStorageLocationFormValue) =>
			await StorageLocationService.updateWarehouseStorage(_id, payload)
	})
}

export function useDeleteStorageMutation(warehouseId: string) {
	return useMutation({
		meta: { invalidates: [[WarehouseQueryKeys.WAREHOUSE, warehouseId]] },
		mutationFn: StorageLocationService.deleteWarehouseStorage
	})
}
