import { z } from 'zod'

export const reportDataSchema = z.object({
	data: z.array(
		z.object({
			size_numcode: z.string(),
			mn_ist_qty: z.number().min(0, { message: 'Invalid value' }),
			mn_ost_qty: z.number().min(0, { message: 'Invalid value' })
		})
	)
})

export type InventoryAuditFormValues = z.infer<typeof reportDataSchema>
