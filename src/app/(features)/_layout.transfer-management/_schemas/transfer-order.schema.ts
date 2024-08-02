import { OrderStatus } from '@/common/constants/enums'
import { z } from 'zod'

export const updateTransferOrderSchema = z.object({
	or_warehouse: z.string(),
	or_location: z.string(),
	new_warehouse: z.string(),
	new_location: z.string()
})

export const updateApprovalStatusSchema = z.object({
	status_approve: z.nativeEnum(OrderStatus).optional(),
	employee_name_approve: z.string().optional(),
	approve_date: z.date().optional()
})

export const updateTransferOrderDetailSchema = z.object({
	or_no: z.string(),
	trans_num: z.number(),
	sno_qty: z.number(),
	or_qtyperpacking: z.number(),
	kg_nostart: z.number(),
	kg_noend: z.number()
})

export type UpdateTransferOrderValues = z.infer<typeof updateTransferOrderSchema>
export type UpdateApprovalStatusValues = z.infer<typeof updateApprovalStatusSchema>
export type UpdateTransferOrderDetailValues = z.infer<typeof updateTransferOrderDetailSchema>
