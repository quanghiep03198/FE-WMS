import z from 'zod'

// BIC container code pattern: 4 letters (owner code), 1 letter (equipment category), 6 digits (serial), 1 digit (check)
// const BIC_CONTAINER_PATTERN = /^[A-Z]{3}[UJZ]{1}\d{6}\d{1}$/

export const createDeliverySchema = z
	.object({
		license_plate: z
			.string({ error: 'ns_validation:required' })
			.trim()
			.transform((value) => value.toUpperCase())
			.optional(),
		container_number: z
			.string({ error: 'ns_validation:required' })
			.trim()
			// .regex(BIC_CONTAINER_PATTERN, { message: 'ns_validation:invalid_value' }) // ? Should follow BIC format
			.optional(),
		outbound_purchase_orders: z.array(
			z.object({
				po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
				outbound_qty: z.number({ message: 'ns_validation:required' }).int().positive(),
				max_outbound_qty: z.number().nonnegative().default(Infinity)
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

export const updateDispatchOrderSchema = z.object({
	dispatch_order: z.string({ error: 'ns_validation:required' }).trim().nonempty({ error: 'ns_validation:required' }),
	license_plate: z
		.string({ error: 'ns_validation:required' })
		.trim()
		.nonempty({ error: 'ns_validation:required' })
		.transform((value) => value.toUpperCase()),
	container_number: z
		.string({ error: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' })
})

export const upsertPurchaseOrdersSchema = z
	.object({
		dispatch_order: z
			.string({ error: 'ns_validation:required' })
			.trim()
			.nonempty({ error: 'ns_validation:required' }),
		outbound_purchase_orders: z.array(
			z.object({
				id: z.number().or(z.string()).default(null),
				po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
				outbound_qty: z.number({ message: 'ns_validation:required' }).int().positive(),
				max_outbound_qty: z.number().nonnegative().default(Infinity)
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
					message: 'This PO has been added already',
					fatal: true,
					path: [`outbound_purchase_orders.${index}.po`]
				})
		})
	})

export type CreateDeliveryFormValues = z.infer<typeof createDeliverySchema>
export type UpdateDispatchOrderFormValues = z.infer<typeof updateDispatchOrderSchema>
export type UpsertPurchaseOrdersFormValues = z.infer<typeof upsertPurchaseOrdersSchema>
