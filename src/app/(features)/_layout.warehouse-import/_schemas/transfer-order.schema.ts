import { OrderStatus } from '@/common/constants/enums'
import { z } from 'zod'

export const updateTransferOrderSchema = z.object({
	or_warehouse: z.string().trim().min(1, { message: 'ns_validation:required' }),
	or_location: z.string().trim().min(1, { message: 'ns_validation:required' }),
	new_warehouse: z.string().trim().min(1, { message: 'ns_validation:required' }),
	new_location: z.string().trim().min(1, { message: 'ns_validation:required' })
})

export const updateApprovalStatusSchema = z.object({
	status_approve: z.nativeEnum(OrderStatus).optional(),
	employee_name_approve: z.string().optional(),
	approve_date: z.date().optional()
})

export const updateTransferOrderDetailSchema = z.object({
	or_no: z.string().trim().min(1, { message: 'ns_validation:required' }),
	trans_num: z.number({ required_error: 'ns_validation:required' }),
	sno_qty: z.number({ required_error: 'ns_validation:required' }),
	or_qtyperpacking: z.number({ required_error: 'ns_validation:required' }),
	kg_nostart: z.number({ required_error: 'ns_validation:required' }),
	kg_noend: z.number({ required_error: 'ns_validation:required' })
})

export type UpdateTransferOrderValues = z.infer<typeof updateTransferOrderSchema>
export type UpdateApprovalStatusValues = z.infer<typeof updateApprovalStatusSchema>
export type UpdateTransferOrderDetailValues = z.infer<typeof updateTransferOrderDetailSchema>
