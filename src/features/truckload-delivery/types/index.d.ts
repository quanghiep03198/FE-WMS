import type { IBaseEntity } from '@common/types/entities'
import type { IUser } from '@features/auth/types'
import type { TruckloadDeliveryStatus } from '../constants'

export type TruckloadDeliveryDispatchOrder = `GL${number}-EXP-${string}-${string}`

export interface ITruckloadDelivery {
	dispatch_order: TruckloadDeliveryDispatchOrder
	factory_code: string
	container_number: Nullish<string>
	license_plate: Nullish<string>
	seal_number: Nullish<string>
	outbound_qty: number
	factory_entrance_time: Nullish<Date>
	approval_status: TruckloadDeliveryStatus
	ie_signature?: Nullish<string>
	warehouse_officer_signature?: Nullish<string>
	security_1_signature?: Nullish<string>
	security_2_signature?: Nullish<string>
	punctured_container: boolean
	smelling_container: boolean
	moist_container: boolean
	total_outbound_qty: number
	container_sealing_time: Nullish<Date>
	factory_departure_time: Nullish<Date>
	actual_snap_time: Nullish<Date>
	actual_departure_time: Nullish<Date>
	license_plate_image: Nullish<string>
	possible_signing_late: boolean
	packing: Array<ITruckloadDeliveryPacking>
	created_at: Date
	updated_at?: Date | null
	created_by: Pick<IUser, '_id', 'username' | 'display_name'>
	updated_by?: Pick<IUser, '_id', 'username' | 'display_name'> | null
}

export interface ITruckloadDeliveryPacking extends Omit<IBaseEntity, 'id'> {
	po: string
	brand_name: Nullish<string>
	factory_shoes_style: Nullish<string>
	color_sn: Nullish<string>
	order_qty: number
	outbound_qty: number
	dispatched_outbound_qty: number
	max_outbound_qty: number
	created_by: Pick<IUser, '_id', 'username' | 'display_name'>
	updated_by?: Pick<IUser, '_id', 'username' | 'display_name'> | null
}

/**
 * @deprecated
 */
export type QrCodeScannedResult = {
	employee_code: string
	employee_name_show: string
}
