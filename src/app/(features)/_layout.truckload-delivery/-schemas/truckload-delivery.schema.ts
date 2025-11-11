import { parse } from 'date-fns'
import z from 'zod'

export const createTruckloadDeliverySchema = z.object({
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

export const updateTruckloadDeliverySchema = createTruckloadDeliverySchema.partial().extend({
	factory_departure_time: z.object({
		date: z.coerce.date(),
		time: z.string().refine(
			(value) => {
				const parsed = parse(value, 'HH:mm', new Date())
				// Check if parsing was successful and matches the input
				return (
					parsed instanceof Date &&
					!isNaN(parsed.getTime()) &&
					value ===
						`${parsed.getHours().toString().padStart(2, '0')}:${parsed.getMinutes().toString().padStart(2, '0')}`
				)
			},
			{ message: 'Invalid time format (HH:mm)' }
		)
	})
})

export type CreateTruckloadDeliveryFormValues = z.infer<typeof createTruckloadDeliverySchema>
export type UpdateTruckloadDeliveryFormValues = z.infer<typeof updateTruckloadDeliverySchema>
