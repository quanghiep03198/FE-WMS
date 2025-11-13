import z from 'zod'

export const createTruckloadDeliverySchema = z.object({
	outbound_purchase_orders: z.array(
		z.object({
			po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
			outbound_qty: z.number().nonnegative()
		})
	)
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
