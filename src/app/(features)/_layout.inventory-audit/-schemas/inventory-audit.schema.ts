import { array, number, object, string, type infer as Infer } from 'zod'

export const reportDataSchema = object({
	data: array(
		object({
			size_numcode: string(),
			mn_ist_qty: number().min(0, { message: 'Invalid value' }),
			mn_ost_qty: number().min(0, { message: 'Invalid value' })
		})
	)
})

export type InventoryAuditFormValues = Infer<typeof reportDataSchema>
