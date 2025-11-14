import z from 'zod'

export const createTruckloadDeliverySchema = z
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

export const updateTruckloadDeliverySchema = z
	.object({
		po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
		license_plate: z
			.string({ message: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' })
			.transform((value) => value.toUpperCase()),
		container_number: z
			.string({ message: 'ns_validation:required' })
			.trim()
			.nonempty({ message: 'ns_validation:required' }),
		outbound_qty: z.number().nonnegative()
	})
	.partial()

export type CreateTruckloadDeliveryFormValues = z.infer<typeof createTruckloadDeliverySchema>
export type UpdateTruckloadDeliveryFormValues = z.infer<typeof updateTruckloadDeliverySchema>

export type TruckloadDeliveryFormValues = CreateTruckloadDeliveryFormValues | UpdateTruckloadDeliveryFormValues
