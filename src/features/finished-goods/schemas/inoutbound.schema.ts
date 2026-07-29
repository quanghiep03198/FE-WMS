import { enum as enums, object, string, type infer as Infer } from 'zod'
import { FinishedGoodsAction, FinishedGoodsOutboundReason } from '../constants/enums'

export const outboundSchema = object({
	rfid_status: enums(FinishedGoodsAction),
	rfid_use: enums(FinishedGoodsOutboundReason)
})

export const stockVariationSchema = outboundSchema.extend({
	warehouse_num: string().trim().nonempty({ message: 'ns_validation:required' }),
	storage: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_code: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
	dept_name: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' })
})

export type InboundFormValues = Infer<typeof stockVariationSchema>
export type OutboundFormValues = Infer<typeof outboundSchema>
export type FormValues = InboundFormValues | OutboundFormValues
export type StockVariationPayload = FormValues & { mo_no: string; inbound_device_sn: string }
