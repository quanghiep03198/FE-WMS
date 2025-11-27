import { array, object, string, type infer as Infer } from 'zod'

export const defectiveGoodsInboundFormValues = object({
	epcs: array(string()).nonempty(),
	storage_location: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.transform((value) => value.toUpperCase())
})

export const defectiveGoodsOutboundFormValues = object({
	epcs: array(string()).nonempty(),
	outbound_purpose: string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export type DefectiveGoodsInboundFormValues = Infer<typeof defectiveGoodsInboundFormValues>
export type DefectiveGoodsOutboundFormValues = Infer<typeof defectiveGoodsOutboundFormValues>
