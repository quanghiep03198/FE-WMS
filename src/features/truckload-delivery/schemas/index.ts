import { format, isBefore } from 'date-fns'
import { isEmpty, isNil, omitBy } from 'lodash-es'
import {
	array,
	boolean,
	coerce,
	date,
	enum as enumeration,
	literal,
	number,
	object,
	string,
	type infer as Infer
} from 'zod'
import type { TruckloadDeliveryDispatchOrder } from '../types'

// BIC container code pattern: 3 letters (owner code), 1 letter (equipment category), 6 digits (serial), 1 digit (check)
const BIC_CONTAINER_PATTERN = /^[A-Z]{4}\d{7}$/
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
	seal_number: string({ error: 'ns_validation:required' }).trim().nullish(),
	outbound_purchase_orders: array(
		object({
			po: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
			outbound_qty: number({ message: 'ns_validation:required' }).int().positive(),
			brand_name: string().nullish(),
			factory_shoes_style: string().nullish(),
			color_sn: string().nullish(),
			max_outbound_qty: number()
				.positive()
				.or(literal(Infinity))
				.refine((value) => {
					if (value === null || value === undefined) return true
					return !Number.isNaN(+value)
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
	dispatch_order: string({ error: 'ns_validation:required' })
		.trim()
		.nonempty({ error: 'ns_validation:required' })
		.refine((value): value is TruckloadDeliveryDispatchOrder => /^GL\d+-EXP-.+-.+$/.test(value), {
			error: 'ns_validation:invalid_value'
		}),
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
	factory_entrance_time: object({
		date: date({ error: 'ns_validation:invalid_value' }).optional(),
		time: string({ error: 'ns_validation:invalid_value' }).optional()
	}).optional(),
	factory_departure_time: object({
		date: date({ error: 'ns_validation:invalid_value' }).optional(),
		time: string({ error: 'ns_validation:invalid_value' }).optional()
	}).optional(),
	seal_number: string({ error: 'ns_validation:required' })
		.trim()
		.nullish()
		.transform((value) => (isNil(value) ? null : value.toUpperCase())),
	punctured_container: boolean().optional(),
	smelling_container: boolean().optional(),
	moist_container: boolean().optional(),
	remark: string().trim().max(255, { error: 'ns_validation:too_long' }).nullish()
})
	.superRefine((values, ctx) => {
		if (
			(values.factory_entrance_time?.date && !values.factory_entrance_time?.time) ||
			(!values.factory_entrance_time?.date && values.factory_entrance_time?.time)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['factory_entrance_time', 'date'],
				message: 'ns_validation:required'
			})
		}
		if (
			(values.factory_departure_time?.date && !values.factory_departure_time?.time) ||
			(!values.factory_departure_time?.date && values.factory_departure_time?.time)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['factory_departure_time', 'date'],
				message: 'ns_validation:required'
			})
		}
		if (
			values.factory_departure_time?.date &&
			values.factory_entrance_time?.date &&
			values.factory_departure_time?.time &&
			values.factory_entrance_time?.time
		) {
			const entranceDateTime = new Date(
				format(values.factory_entrance_time.date, 'yyyy-MM-dd') + ' ' + values.factory_entrance_time.time
			)
			const departureDateTime = new Date(
				format(values.factory_departure_time.date, 'yyyy-MM-dd') + ' ' + values.factory_departure_time.time
			)
			if (isBefore(departureDateTime, entranceDateTime)) {
				ctx.addIssue({
					code: 'custom',
					path: ['factory_departure_time', 'date'],
					message: 'ns_validation:invalid_value'
				})
			}
		}
	})
	.transform((values) => {
		if (Object.values(values?.factory_entrance_time ?? {}).every(isNil)) delete values.factory_entrance_time
		if (Object.values(values?.factory_departure_time ?? {}).every(isNil)) delete values.factory_departure_time
		return omitBy(values, (value) => isNil(value) || isEmpty(value))
	})

export const upsertPurchaseOrdersSchema = object({
	dispatch_order: string({ error: 'ns_validation:required' }).trim().nonempty({ error: 'ns_validation:required' }),
	outbound_purchase_orders: array(
		object({
			po: string({ message: 'ns_validation:required' }).trim().nonempty({ message: 'ns_validation:required' }),
			outbound_qty: number({ message: 'ns_validation:required' }).int().positive(),
			brand_name: string().nullish(),
			factory_shoes_style: string().nullish(),
			color_sn: string().nullish(),
			max_outbound_qty: number()
				.positive()
				.or(literal(Infinity))
				.nullish()
				.refine((value) => {
					if (value === null || value === undefined) return true
					return !Number.isNaN(+value)
				})
				.default(Infinity)
				.transform((value) => (isNil(value) ? Infinity : +value)),
			created_at: string().nullish(),
			created_by: string().nullish()
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

export const truckloadDeliveryFilterSchema = object({
	where: array(
		object({
			column: enumeration([
				'approval_status',
				'license_plate',
				'container_number',
				'seal_number',
				'po',
				'created_at',
				'container_sealing_time',
				'factory_entrance_time',
				'factory_departure_time',
				'actual_departure_time'
			]).nullish(),
			operator: enumeration([
				'like:%@value%',
				'=:@value',
				'like:@value%',
				'like:%@value',
				'between:@value1,@value2'
			]).nullish(),
			value: string()
				.or(coerce.date())
				.or(object({ from: coerce.date(), to: coerce.date() }))
				.nullish()
		})
	).superRefine((values, context) => {
		values.forEach((item, index) => {
			if (item.column && (!item.value || !item.operator))
				context.addIssue({
					code: 'custom',
					input: item,
					message: 'ns_validation:required',
					path: [`where.${index}.value`, `where.${index}.operator`]
				})
		})
	})
})

export type CreateDeliveryFormValues = Infer<typeof createDeliverySchema>
export type UpsertPurchaseOrdersFormValues = Infer<typeof upsertPurchaseOrdersSchema>
export type UpdateContainerConditionFormValues = Infer<typeof updateContainerConditionSchema>
export type UpdateDispatchOrderFormValues = Omit<Infer<typeof updateDispatchOrderSchema>, 'dispatch_order'> & {
	dispatch_order: TruckloadDeliveryDispatchOrder
}
export type TruckloadDeliveryFilterFormValues = Infer<typeof truckloadDeliveryFilterSchema>
export type FilterOperator = ArrayElement<TruckloadDeliveryFilterFormValues['where']>['operator']
export type FilterColumn = ArrayElement<TruckloadDeliveryFilterFormValues['where']>['column']
export type FilterValue = ArrayElement<TruckloadDeliveryFilterFormValues['where']>['value']
