import { i18n } from '@/i18n'
import { z } from 'zod'
import { DefectiveLocation, DefectiveType } from '../-constants'

export const createDefectiveGoodsSchema = z
	.object({
		epc: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' })
			.length(24, i18n.t('ns_validation:min_length', { min: 24 })),
		category: z.nativeEnum(DefectiveType, { required_error: 'ns_validation:required' }),
		po: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' })
			.optional(),
		mo_no: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' })
			.optional(),
		brand_name: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' }),
		factory_shoes_style: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' }),
		color_sn: z
			.string({ required_error: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' }),
		size_code: z.string({ required_error: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
		defect_location: z.nativeEnum(DefectiveLocation, { required_error: 'ns_validation:required' }),
		storage: z
			.string({ required_error: 'ns_validation:required', message: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' }),
		defect_description: z
			.string({ required_error: 'ns_validation:required' })
			.nonempty({ message: 'ns_validation:required' })
	})
	.refine((values) => {
		if (values.category === DefectiveType.B_GRADE) return !!values.po && !!values.mo_no
		return true
	})

export type CreateDefectiveGoodsFormValues = z.infer<typeof createDefectiveGoodsSchema>
