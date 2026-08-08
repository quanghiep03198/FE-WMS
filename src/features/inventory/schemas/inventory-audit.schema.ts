import { array, number, object, string, type infer as Infer } from 'zod'

export const reportDataSchema = object({
	data: array(
		object({
			size_numcode: string(),
			supplemental_stocked_in_qty: number().nonnegative({ error: 'ns_validation:invalid_value' }),
			supplemental_shipped_out_qty: number().nonnegative({ error: 'ns_validation:invalid_value' })
		})
	)
})

export type InventoryAuditFormValues = Infer<typeof reportDataSchema>
