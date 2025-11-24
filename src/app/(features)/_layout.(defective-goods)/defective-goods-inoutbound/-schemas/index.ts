import z from 'zod'

export const defectiveGoodsInboundFormValues = z.object({
	epcs: z.array(z.string()).nonempty(),
	storage_location: z
		.string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
		.transform((value) => value.toUpperCase())
})

export const defectiveGoodsOutboundFormValues = z.object({
	epcs: z.array(z.string()).nonempty(),
	outbound_purpose: z.string({ message: 'ns_validation:required' }).nonempty({ message: 'ns_validation:required' })
})

export type DefectiveGoodsInboundFormValues = z.infer<typeof defectiveGoodsInboundFormValues>
export type DefectiveGoodsOutboundFormValues = z.infer<typeof defectiveGoodsOutboundFormValues>
