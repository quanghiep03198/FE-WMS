import type { IDefectiveGoods } from '@/features/defective-goods/services/defective-goods.service'
import { useMemo } from 'react'

export const useGetUniqStorageLocation = <T extends Partial<IDefectiveGoods>>(data: T[]) => {
	return useMemo(() => {
		const locationSet = new Set<string>()
		if (Array.isArray(data)) {
			data.forEach((item: T) => {
				const storageLocations = item.storage_location?.split(',')
				if (Array.isArray(storageLocations)) {
					storageLocations.forEach((loc) => locationSet.add(loc))
				}
			})
		}
		return Array.from(locationSet)
			.sort((a, b) => a?.localeCompare(b))
			.map((loc) => ({ value: loc, label: loc }))
	}, [data])
}
