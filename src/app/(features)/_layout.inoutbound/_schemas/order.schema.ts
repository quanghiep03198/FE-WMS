import { z } from 'zod'

export const updateOrderSchema = z.object({
	mo_no: z.string().refine((value) => !!value, { message: 'Please select an order code' })
})

export type UpdateOrderFormValue = z.infer<typeof updateOrderSchema>
