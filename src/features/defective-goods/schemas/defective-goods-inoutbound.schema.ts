import { array, object, string, type infer as Infer } from 'zod'
import { DefectiveGoodsOutboundPurpose } from '../constants/enums'

export const defectiveGoodsInboundFormValues = object({
	epcs: array(string()).nonempty(),
	storage_location: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.transform((value) => value.toUpperCase())
})

export const defectiveGoodsOutboundFormValues = object({
	epcs: array(string()).nonempty(),
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
})

export type DefectiveGoodsInboundFormValues = Infer<typeof defectiveGoodsInboundFormValues>
export type DefectiveGoodsOutboundFormValues = Infer<typeof defectiveGoodsOutboundFormValues>
export type InboundOutboundFormValues = DefectiveGoodsInboundFormValues | DefectiveGoodsOutboundFormValues
