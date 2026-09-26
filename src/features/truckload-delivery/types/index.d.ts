import type { IBaseEntity } from '@common/types/entities'
import type { TruckloadDeliveryStatus } from '../constants'

export type TruckloadDeliveryDispatchOrder = `GL${number}-EXP-${string}-${string}`

export interface ITruckloadDelivery extends IBaseEntity {
	dispatch_order: TruckloadDeliveryDispatchOrder
	factory_code: string
	license_plate: string
	outbound_qty: number
	approval_status: TruckloadDeliveryStatus
	ie_signature: string
	warehouse_officer_signature: string
	security_1_signature: string
	security_2_signature: string
	punctured_container: boolean
	smelling_container: boolean
	moist_container: boolean
	container_sealing_time: Date | null
	factory_departure_time: Date | null
	actual_snap_time: Date | null
	actual_departure_time: Date | null
	license_plate_image: string | null
	total_outbound_qty: number
	possible_signing_late?: boolean
	delivery_details?: Array<ITruckloadDeliveryDetail>
}

export interface ITruckloadDeliveryDetail extends Omit<IBaseEntity, 'id'> {
	id: string | number
	po: string
	brand_name: string | null
	factory_shoes_style: string | null
	color_sn: string | null
	po_qty: number
	outbound_qty: number
	dispatched_outbound_qty: number
	max_outbound_qty?: number | null
}

/**
 * @deprecated
 */
export type QrCodeScannedResult = {
	employee_code: string
	employee_name_show: string
}
