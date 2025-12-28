import { isNil } from 'lodash-es'
import { any, array, boolean, number, object, string, type infer as Infer } from 'zod'

// BIC container code pattern: 3 letters (owner code), 1 letter (equipment category), 6 digits (serial), 1 digit (check)
const BIC_CONTAINER_PATTERN = /^[A-Z]\d{7}$/
const ALPHANUMERIC_PATTERN = /^[A-Za-z0-9]+$/

export const createDeliverySchema = object({
	license_plate: string({ error: 'ns_validation:required' })
		.trim()
		.regex(ALPHANUMERIC_PATTERN, { message: 'ns_validation:invalid_value' })
		.transform((value) => value.toUpperCase())
		.nullish(),
	container_number: string({ error: 'ns_validation:required' })
		.trim()
		.regex(BIC_CONTAINER_PATTERN, { message: 'ns_validation:invalid_value' }) // ? Should follow BIC format
		.nullish(),
	outbound_purchase_orders: array(
		object({
			po: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
			outbound_qty: number({ message: 'ns_validation:required' }).int().positive(),
			max_outbound_qty: any()
				.nullish()
				.refine((value) => {
					if (value === null || value === undefined) return true
					return !isNaN(+value)
				})
				.default(Infinity)
		})
	)
}).superRefine((values, context) => {
	values.outbound_purchase_orders.forEach((item, index) => {
		if (item.outbound_qty > item.max_outbound_qty)
			context.addIssue({
				code: 'too_big',
				message: 'ns_validation:invalid_value',
				maximum: item.max_outbound_qty,
				type: 'number',
				origin: 'number',
				inclusive: true,
				path: [`outbound_purchase_orders.${index}.outbound_qty`]
			})
		if (values.outbound_purchase_orders.findIndex((otherItem) => otherItem.po === item.po) !== index)
			context.addIssue({
				code: 'custom',
				message: 'Do not select the same PO',
				fatal: true,
				path: [`outbound_purchase_orders.${index}.po`]
			})
	})
})

export const updateContainerConditionSchema = object({
	punctured_container: boolean().optional(),
	smelling_container: boolean().optional(),
	moist_container: boolean().optional()
})

export const updateDispatchOrderSchema = object({
	dispatch_order: string({ error: 'ns_validation:required' }).trim().nonempty({ error: 'ns_validation:required' }),
	license_plate: string({ error: 'ns_validation:required' })
		.trim()
		.regex(ALPHANUMERIC_PATTERN, { message: 'ns_validation:invalid_value' })
		.nullish()
		.transform((value) => (isNil(value) ? null : value.toUpperCase())),
	container_number: string({ error: 'ns_validation:required' })
		.trim()
		.regex(BIC_CONTAINER_PATTERN, { message: 'ns_validation:invalid_value' })
		.nullish()
		.transform((value) => (isNil(value) ? null : value.toUpperCase())),
	punctured_container: boolean().optional(),
	smelling_container: boolean().optional(),
	moist_container: boolean().optional(),
	remark: string().trim().max(255, { error: 'ns_validation:too_long' }).nullish()
})

export const upsertPurchaseOrdersSchema = object({
	dispatch_order: string({ error: 'ns_validation:required' }).trim().nonempty({ error: 'ns_validation:required' }),
	outbound_purchase_orders: array(
		object({
			id: number().or(string()).default(null),
			po: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
			outbound_qty: number({ message: 'ns_validation:required' }).int().positive(),
			max_outbound_qty: number().nonnegative().default(Infinity)
		})
	)
}).superRefine((values, context) => {
	values.outbound_purchase_orders.forEach((item, index) => {
		if (item.outbound_qty > item.max_outbound_qty)
			context.addIssue({
				code: 'too_big',
				message: 'ns_validation:invalid_value',
				maximum: item.max_outbound_qty,
				type: 'number',
				origin: 'number',
				inclusive: true,
				path: [`outbound_purchase_orders.${index}.outbound_qty`]
			})
		if (values.outbound_purchase_orders.findIndex((otherItem) => otherItem.po === item.po) !== index)
			context.addIssue({
				code: 'custom',
				message: 'This PO has been added already',
				fatal: true,
				path: [`outbound_purchase_orders.${index}.po`]
			})
	})
})

export type CreateDeliveryFormValues = Infer<typeof createDeliverySchema>
export type UpsertPurchaseOrdersFormValues = Infer<typeof upsertPurchaseOrdersSchema>
export type UpdateContainerConditionFormValues = Infer<typeof updateContainerConditionSchema>
export type UpdateDispatchOrderFormValues = Infer<typeof updateDispatchOrderSchema> &
	Partial<UpdateContainerConditionFormValues>
