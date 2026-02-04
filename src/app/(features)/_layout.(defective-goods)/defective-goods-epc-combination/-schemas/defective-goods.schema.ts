import { isEmpty, isNil } from 'lodash-es'
import { array, enum as enums, number, object, string, type infer as Infer } from 'zod'
import { DefectiveCategory, DefectiveGoodsSource, DefectiveLocation } from '../../-constants'

export const baseDefectiveGoodsSchema = object({
	ri_type: enums(['uhf', 'usb', 'manually'], { message: 'ns_validation:required' }).nullish(),
	epc: array(string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }))
		.or(string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }))
		.optional(),
	defective_category: enums(DefectiveCategory, { message: 'ns_validation:required' }),
	po: string({ message: 'ns_validation:required' }).nullish(),
	mo_no: string({ message: 'ns_validation:required' }).nullish(),
	brand_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	cust_shoes_style: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	factory_shoes_style: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	color_sn: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	size_code: string({ message: 'ns_validation:required' }).trim().nullish(),
	shoe_source: enums(DefectiveGoodsSource).optional(),
	defective_location: enums(DefectiveLocation, { message: 'ns_validation:required' }),
	defective_description: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	assembly_line: string({ message: 'ns_validation:required' }).trim().nullish(),
	sewing_line: string({ message: 'ns_validation:required' }).trim().nullish()
})

export const createDefectiveGoodsSchema = baseDefectiveGoodsSchema
	.extend({
		sizes: array(
			object({
				size_code: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
				qty: number({ message: 'ns_validation:required' }).min(1, { message: 'ns_validation:invalid_value' })
			})
		).nullish()
	})
	.optional()
	.superRefine((values, context) => {
		if (
			(values.defective_category === DefectiveCategory.B_GRADE ||
				values.defective_category === DefectiveCategory.C_GRADE) &&
			!values.mo_no
		)
			context.addIssue({
				path: ['mo_no'],
				code: 'custom',
				message: 'ns_validation:required',
				fatal: true
			})
	})
	.superRefine((values, context) => {
		switch (values.ri_type) {
			case 'uhf': {
				if (!Array.isArray(values.epc) || values.epc.length === 0)
					context.addIssue({
						path: ['epc'],
						code: 'custom',
						message: 'EPCs are required when combination strategy is UHF',
						fatal: true
					})
				if (isNil(values.size_code) || isEmpty(values.size_code.trim()))
					context.addIssue({
						path: ['size_code'],
						code: 'custom',
						message: 'ns_validation:required',
						fatal: true
					})
				break
			}
			case 'usb': {
				if (typeof values.epc !== 'string' || values.epc.trim() === '')
					context.addIssue({
						path: ['epc'],
						code: 'custom',
						message: 'EPCs are required when combination strategy is USB',
						fatal: true
					})
				if (isNil(values.size_code) || isEmpty(values.size_code.trim()))
					context.addIssue({
						path: ['size_code'],
						code: 'custom',
						message: 'ns_validation:required',
						fatal: true
					})
				break
			}
			case 'manually': {
				if (!Array.isArray(values.sizes))
					context.addIssue({
						path: ['sizes'],
						code: 'custom',
						message: 'Sizes are required when combination strategy is manually',
						fatal: true
					})
				break
			}
			default:
				break
		}
	})
	.superRefine((values, context) => {
		if (Array.isArray(values.sizes) && values.ri_type === 'manually')
			values.sizes.forEach((item, index) => {
				if (values.sizes.findIndex((otherItem) => otherItem.size_code === item.size_code) !== index)
					context.addIssue({
						path: [`sizes.${index}.size_code`],
						code: 'custom',
						message: 'Do not select the same Size',
						fatal: true
					})
			})
	})

export const updateDefectiveGoodsSchema = baseDefectiveGoodsSchema.partial().refine((values) => {
	if (values.defective_category === DefectiveCategory.B_GRADE) return !!values.mo_no
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
