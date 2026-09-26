import { enum as enums, object, string, type infer as Infer } from 'zod'
import { FinishedGoodsStockAction, StockTransactionPurpose } from '../constants/enums'

export const outboundSchema = object({
	action: enums(FinishedGoodsStockAction),
	purpose: enums(StockTransactionPurpose)
})

export const stockBalancesSchema = outboundSchema.extend({
	warehouse: string().trim().nonempty({ message: 'ns_validation:required' }),
	storage_location: string({ message: 'ns_validation:required' })
		.trim()
		.nonempty({ message: 'ns_validation:required' }),
	assembly_line: object({
		name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
		code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
	})
	// dept_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	// dept_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
})

export type InboundFormValues = Infer<typeof stockBalancesSchema>
export type OutboundFormValues = Infer<typeof outboundSchema>
export type FormValues = InboundFormValues | OutboundFormValues
export type StockBalancesPayload = FormValues & { mo_no: string; inbound_device_sn: string }
