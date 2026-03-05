import { array, number, object, string, type infer as Infer } from 'zod'

export const reportDataSchema = object({
	data: array(
		object({
			size_numcode: string(),
			mn_ist_qty: number().nonnegative({ error: 'ns_validation:invalid_value' }),
			mn_ost_qty: number().nonnegative({ error: 'ns_validation:invalid_value' })
		})
	)
})

export type InventoryAuditFormValues = Infer<typeof reportDataSchema>
