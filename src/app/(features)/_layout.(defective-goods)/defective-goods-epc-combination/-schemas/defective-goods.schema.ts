import { z } from 'zod'
import { DefectiveCategory, DefectiveLocation } from '../../-constants'

export const baseDefectiveGoodsSchema = z.object({
	epc: z
		.array(z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }))
		.or(z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })),
	category: z.enum(DefectiveCategory, { message: 'ns_validation:required' }),
	po: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }).optional(),
	mo_no: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }).optional(),
	brand_name: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	color_sn: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	size_code: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	defect_location: z.enum(DefectiveLocation, { message: 'ns_validation:required' }),
	defect_description: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export const createDefectiveGoodsSchema = baseDefectiveGoodsSchema.refine((values) => {
	if (values.category === DefectiveCategory.B_GRADE) return !!values.po && !!values.mo_no
	return true
})

export const updateDefectiveGoodsSchema = baseDefectiveGoodsSchema.partial().refine((values) => {
	if (values.category === DefectiveCategory.B_GRADE) return !!values.po && !!values.mo_no
	return true
})

export type CreateDefectiveGoodsFormValues = z.infer<typeof createDefectiveGoodsSchema>
export type UpdateDefectiveGoodsFormValues = z.infer<typeof updateDefectiveGoodsSchema>
