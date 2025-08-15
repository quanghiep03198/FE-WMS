import { z } from 'zod'
import { DefectiveLocation, DefectiveType } from '../-constants'

export const createDefectiveGoodsSchema = z
	.object({
		epc: z
			.string({ required_error: 'ns_validation.required' })
			.nonempty('ns_validation.required')
			.length(24, 'ns_validation.invalid_length'),
		category: z.nativeEnum(DefectiveType),
		po: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required').optional(),
		mo_no: z.number({ required_error: 'ns_validation.required' }).min(1, 'ns_validation.min_value').optional(),
		brand_name: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required'),
		factory_shoes_style: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required'),
		color_sn: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required'),
		size_code: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required'),
		defect_location: z.nativeEnum(DefectiveLocation),
		storage: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required'),
		defect_description: z.string({ required_error: 'ns_validation.required' }).nonempty('ns_validation.required')
	})
	.refine((values) => {
		if (values.category === DefectiveType.B_GRADE) return !!values.po && !!values.mo_no
		return true
	})

export type CreateDefectiveGoodsFormValues = z.infer<typeof createDefectiveGoodsSchema>
