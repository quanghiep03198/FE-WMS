import type { FieldValues } from 'react-hook-form'
import { array, enum as enumeric, object, string, type Infer } from 'zod'
import { CombinationStrategy, DefectiveGoodsOutboundPurpose } from '../constants/enums'

export const defectiveGoodsInboundFormValues = object({
	combination_strategy: enumeric(CombinationStrategy),
	epcs: array(string()),
	storage_location: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.transform((value) => value.toUpperCase())
}).superRefine((values, ctx) => {
	if (values.combination_strategy !== CombinationStrategy.MANUALLY && values.epcs.length === 0)
		ctx.addIssue({
			path: ['epcs'],
			code: 'custom',
			message: 'ns_validation:required'
		})
})

export const defectiveGoodsOutboundFormValues = object({
	combination_strategy: enumeric(CombinationStrategy),
	epcs: array(string()),
	outbound_purpose: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' }),
	po: string({ message: 'ns_validation:required' }).trim().optional() // optional field for outbound
}).superRefine((values, ctx) => {
	if (values.outbound_purpose === DefectiveGoodsOutboundPurpose.SHIPPING && !values.po) {
		ctx.addIssue({
			path: ['po'],
			code: 'custom',
			message: 'ns_validation:required'
		})
	}
	if (values.combination_strategy !== CombinationStrategy.MANUALLY && values.epcs.length === 0)
		ctx.addIssue({
			path: ['epcs'],
			code: 'custom',
			message: 'ns_validation:required'
		})
})

export type DefectiveGoodsInboundFormValues = Infer<typeof defectiveGoodsInboundFormValues> & FieldValues
export type DefectiveGoodsOutboundFormValues = Infer<typeof defectiveGoodsOutboundFormValues> & FieldValues
export type InboundOutboundFormValues = DefectiveGoodsInboundFormValues | DefectiveGoodsOutboundFormValues
