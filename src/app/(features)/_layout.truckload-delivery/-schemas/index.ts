import z from 'zod'

export const createDeliverySchema = z
	.object({
		outbound_purchase_orders: z.array(
			z.object({
				po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
				outbound_qty: z.number({ message: 'ns_validation:required' }).int().positive(),
				max_outbound_qty: z.number().nonnegative()
			})
		)
	})
	.superRefine((values, context) => {
		values.outbound_purchase_orders.forEach((item, index) => {
			if (item.outbound_qty > item.max_outbound_qty)
				context.addIssue({
					code: 'too_big',
					message: 'ns_validation:invalid_value',
					maximum: item.max_outbound_qty,
					type: 'number',
					origin: 'number',
					inclusive: true,
					path: [`outbound_purchase_orders.${index}.outbound_qty`]
				})
			if (values.outbound_purchase_orders.findIndex((otherItem) => otherItem.po === item.po) !== index)
				context.addIssue({
					code: 'custom',
					message: 'Do not select the same PO',
					fatal: true,
					path: [`outbound_purchase_orders.${index}.po`]
				})
		})
	})

export const updateDeliverySchema = z.object({
	po: z.string({ error: 'ns_validation:required' }).trim().nonempty({ error: 'ns_validation:required' }).optional(),
	license_plate: z
		.string({ error: 'ns_validation:required' })
		.trim()
		.nonempty({ error: 'ns_validation:required' })
		.transform((value) => value.toUpperCase())
		.optional(),
	container_number: z
		.string({ error: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	outbound_qty: z
		.number({ error: 'ns_validation:required' })
		.nonnegative({ error: 'ns_validation:invalid_value' })
		.optional(),
	max_outbound_qty: z.number().nonnegative()
})

export type CreateDeliveryFormValues = z.infer<typeof createDeliverySchema>
export type UpdateDeliveryFormValues = z.infer<typeof updateDeliverySchema>
