import z from 'zod'

export const createTruckloadDeliverySchema = z.object({
	purchase_orders: z.array(
		z
			.object({
				po: z.string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
				outbound_qty: z.number().int().positive(),
				max_outbound_qty: z.number().nonnegative()
			})
			.refine((data) => data.outbound_qty <= data.max_outbound_qty, {
				error: () => {
					return {
						paths: ['outbound_qty'],
						message: 'ns_validation:invalid_value'
					}
				}
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
