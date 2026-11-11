import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'

export const manifestTextFields = [
	'po',
	'brand_name',
	'factory_shoes_style',
	'cust_shoes_style',
	'color_sn',
	'packing_standard',
	'factory_code_produce'
] as const

export const manifestNumberFields = [
	'standard_weight',
	'actual_avg_weight',
	'target_box_qty',
	'target_item_qty',
	'weighed_box_qty',
	'unweighed_box_qty'
] as const

export type ManifestTextField = (typeof manifestTextFields)[number]
export type ManifestNumberField = (typeof manifestNumberFields)[number]
export type ManifestSortField = ManifestTextField | ManifestNumberField
export type ManifestFilters = Partial<Record<ManifestTextField, string>> &
	Partial<Record<`${ManifestNumberField}From` | `${ManifestNumberField}To`, number>> & {
		sortBy?: ManifestSortField
		sortOrder?: 'ASC' | 'DESC'
	}

export function toManifestFilters(filters: ColumnFiltersState, sorting: SortingState): ManifestFilters {
	const result: ManifestFilters = {}
	for (const { id, value } of filters) {
		const textField = manifestTextFields.find((field) => field === id)
		if (textField && typeof value === 'string' && value.trim()) result[textField] = value.trim()
		const numberField = manifestNumberFields.find((field) => field === id)
		if (numberField && Array.isArray(value)) {
			for (const [index, suffix] of (['From', 'To'] as const).entries()) {
				const input: unknown = value[index]
				if ((typeof input === 'string' && input.trim()) || typeof input === 'number') {
					const number = Number(input)
					if (Number.isFinite(number)) result[`${numberField}${suffix}`] = number
				}
			}
		}
	}
	const sort = sorting[0]
	const field = [...manifestTextFields, ...manifestNumberFields].find((item) => item === sort?.id)
	if (sort && field) {
		result.sortBy = field
		result.sortOrder = sort.desc ? 'DESC' : 'ASC'
	}
	return result
}
