import type { IBaseEntity } from '@common/types/entities'
import type { IUser } from '@features/auth/types'
import type { TruckloadDeliveryStatus } from '../constants'

export type TruckloadDeliveryDispatchOrder = `GL${number}-EXP-${string}-${string}`

export interface ITruckloadDelivery {
	dispatch_order: TruckloadDeliveryDispatchOrder
	factory_code: string
	container_number: string | null
	license_plate: string | null
	seal_number: string | null
	outbound_qty: number
	factory_entrance_time?: Date | null
	approval_status: TruckloadDeliveryStatus
	ie_signature?: string | null
	warehouse_officer_signature?: string | null
	security_1_signature?: string | null
	security_2_signature?: string | null
	punctured_container: boolean
	smelling_container: boolean
	moist_container: boolean
	total_outbound_qty: number
	container_sealing_time: Date | null
	factory_departure_time?: Date | null
	actual_snap_time?: Date | null
	actual_departure_time?: Date | null
	license_plate_image?: string | null
	possible_signing_late?: boolean
	packing: Array<ITruckloadDeliveryPacking>
	created_at: Date
	updated_at?: Date | null
	created_by: Pick<IUser, '_id', 'username' | 'display_name'>
	updated_by?: Pick<IUser, '_id', 'username' | 'display_name'> | null
}

export interface ITruckloadDeliveryPacking extends Omit<IBaseEntity, 'id'> {
	po: string
	brand_name: string | null
	factory_shoes_style: string | null
	color_sn: string | null
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
