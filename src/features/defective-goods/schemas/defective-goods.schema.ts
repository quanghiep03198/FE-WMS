import { DefectiveCategory, DefectiveGoodsSource, DefectiveLocation } from '@features/defective-goods/constants/enums'
import { isEmpty, isNil } from 'lodash-es'
import { array, enum as enums, number, object, string, type Infer } from 'zod'

export const baseDefectiveGoodsSchema = object({
	epc: array(string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }))
		.or(string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }))
		.optional(),
	combination_strategy: enums(['uhf', 'usb', 'manually'], { message: 'ns_validation:required' }).nullish(),
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
	size_numcode: string({ message: 'ns_validation:required' }).trim().nullish(),
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
				size_numcode: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
				qty: number({ message: 'ns_validation:required' }).min(1, { message: 'ns_validation:invalid_value' })
			})
		).nullish()
	})
	.optional()
	.superRefine((values, context) => {
		if (
			(values?.defective_category === DefectiveCategory.B_GRADE ||
				values?.defective_category === DefectiveCategory.C_GRADE) &&
			!values?.mo_no
		)
			context.addIssue({
				path: ['mo_no'],
				code: 'custom',
				message: 'ns_validation:required',
				fatal: true
			})
	})
	.superRefine((values, context) => {
		switch (values?.combination_strategy) {
			case 'uhf': {
				if (!Array.isArray(values.epc) || values.epc.length === 0)
					context.addIssue({
						path: ['epc'],
						code: 'custom',
						message: 'EPCs are required when combination strategy is UHF',
						fatal: true
					})
				if (isNil(values.size_numcode) || isEmpty(values.size_numcode.trim()))
					context.addIssue({
						path: ['size_numcode'],
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
				if (isNil(values.size_numcode) || isEmpty(values.size_numcode.trim()))
					context.addIssue({
						path: ['size_numcode'],
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
		if (Array.isArray(values?.sizes) && values.combination_strategy === 'manually')
			values.sizes.forEach((item, index) => {
				if (
					Array.isArray(values?.sizes) &&
					values.sizes.findIndex((otherItem) => otherItem.size_numcode === item.size_numcode) !== index
				)
					context.addIssue({
						path: [`sizes.${index}.size_numcode`],
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

export type CreateDefectiveGoodsSchema = typeof createDefectiveGoodsSchema
export type UpdateDefectiveGoodsSchema = typeof updateDefectiveGoodsSchema

export type CreateDefectiveGoodsFormValues = Infer<CreateDefectiveGoodsSchema>
export type UpdateDefectiveGoodsFormValues = Infer<UpdateDefectiveGoodsSchema>

export type DefectiveGoodsCombinationFormValues = CreateDefectiveGoodsFormValues & UpdateDefectiveGoodsFormValues
export type DefectiveGoodQueryParams = Partial<Omit<DefectiveGoodsCombinationFormValues, 'defective_description'>> & {
	page: number
	epc: string
	created_at?: string | Date
}
