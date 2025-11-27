import { array, enum as enums, object, string, type infer as Infer } from 'zod'
import { DefectiveCategory, DefectiveLocation } from '../../-constants'

export const baseDefectiveGoodsSchema = object({
	epc: array(string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })).or(
		string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
	),
	defective_category: enums(DefectiveCategory, { message: 'ns_validation:required' }),
	po: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }).optional(),
	mo_no: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }).optional(),
	brand_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	cust_shoes_style: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	color_sn: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	size_code: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	defective_location: enums(DefectiveLocation, { message: 'ns_validation:required' }),
	defective_description: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export const createDefectiveGoodsSchema = baseDefectiveGoodsSchema.refine((values) => {
	if (values.defective_category === DefectiveCategory.B_GRADE) return !!values.po && !!values.mo_no
	return true
})

export const updateDefectiveGoodsSchema = baseDefectiveGoodsSchema.partial().refine((values) => {
	if (values.defective_category === DefectiveCategory.B_GRADE) return !!values.po && !!values.mo_no
	return true
})

export type CreateDefectiveGoodsFormValues = Infer<typeof createDefectiveGoodsSchema>
export type UpdateDefectiveGoodsFormValues = Infer<typeof updateDefectiveGoodsSchema>

export type DefectiveGoodsCombinationFormValues = CreateDefectiveGoodsFormValues | UpdateDefectiveGoodsFormValues
export type DefectiveGoodQueryParams = Partial<Omit<DefectiveGoodsCombinationFormValues, 'defective_description'>> & {
	page: number
	epc: string
	created?: string | Date
}
