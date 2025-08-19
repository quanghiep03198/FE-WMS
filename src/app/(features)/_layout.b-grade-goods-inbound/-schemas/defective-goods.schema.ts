import { i18n } from '@/i18n'
import { z } from 'zod'
import { DefectiveCategory, DefectiveLocation } from '../-constants'

export const baseDefectiveGoodsSchema = z.object({
	epc: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.length(24, i18n.t('ns_validation:min_length', { min: 24 })),
	category: z.nativeEnum(DefectiveCategory, { message: 'ns_validation:required' }),
	po: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.optional(),
	mo_no: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.optional(),
	brand_name: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	color_sn: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	size_code: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	defect_location: z.nativeEnum(DefectiveLocation, { message: 'ns_validation:required' }),
	storage_location: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
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
