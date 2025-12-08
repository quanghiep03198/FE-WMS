import { IDefectiveGoods } from '@/services/defective-goods.service'
import { useMemo } from 'react'
import { DefectiveCategory } from '../-constants'

type TData = Partial<IDefectiveGoods> & { size_data: Array<{ size_numcode: string; qty: number }> }

export function useGetCategoriesQty<T extends TData>(data: T[]) {
	return useMemo(() => {
		const result: Record<DefectiveCategory, number> = {
			[DefectiveCategory.B_GRADE]: 0,
			[DefectiveCategory.C_GRADE]: 0,
			[DefectiveCategory.RESEARCH_DEVELOPMENT]: 0
		}
		if (!Array.isArray(data)) return result
		const groupData = Object.groupBy(data, (item) => item.defective_category)
		for (const category in groupData) {
			result[category] = groupData[category].reduce((sum, curr) => {
				if (!Array.isArray(curr.size_data)) return sum
				return sum + curr.size_data.reduce((acc, size) => acc + size.qty, 0)
			}, 0)
		}
		return result
	}, [data])
}
