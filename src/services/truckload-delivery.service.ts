import { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import {
	CreateDeliveryFormValues,
	UpdateDispatchOrderFormValues,
	UpsertPurchaseOrdersFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
import { RequestHeaders } from '@/common/constants/enums'
import { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type TruckloadDeliveryDispatchOrder = `GL${number}-EXP-${string}-${string}`

export interface ITruckloadDelivery extends IBaseEntity {
	dispatch_order: TruckloadDeliveryDispatchOrder
	factory_code: string
	license_plate: string
	factory_departure_time: string
	outbound_qty: number
	approval_status: TruckloadDeliveryStatus
	delivery_details: Array<{
		id: number | string
		po: string
		brand_name: string
		factory_shoes_style: string
		color_sn: string
		outbound_qty: number
		user_code_created: string
		created: Date | null
	}>
}

export class TruckloadDeliveryService {
	static async getAll() {
		return await axiosInstance.get<void, ResponseBody<ITruckloadDelivery[]>>('/truckload-delivery')
	}

	static async insertMany(payload: CreateDeliveryFormValues) {
		return await axiosInstance.post<unknown, CreateDeliveryFormValues>('/truckload-delivery/create', payload)
	}

	static async deleteOne(id: number) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/delete/${id}`)
	}

	static async bulkUpdate(dispatchOrder: string, payload: Omit<UpdateDispatchOrderFormValues, 'dispatch_order'>) {
		return await axiosInstance.patch(`/truckload-delivery/bulk-update/${dispatchOrder}`, payload)
	}

	static async upsertPurchaseOrders({ dispatch_order, ...update }: UpsertPurchaseOrdersFormValues) {
		update.outbound_purchase_orders = update.outbound_purchase_orders.map((item) => ({
			...item,
			id: typeof item.id === 'number' ? item.id : null
		}))

		return await axiosInstance.put(`/truckload-delivery/upsert-purchase-orders/${dispatch_order}`, update)
	}

	static async bulkDelete(dispatchOrder: TruckloadDeliveryDispatchOrder) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/bulk-delete/${dispatchOrder}`)
	}

	static async setStatusByDispatchOrder(
		dispatchOrder: TruckloadDeliveryDispatchOrder,
		status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE,
		otp: string
	) {
		return await axiosInstance.patch(
			`/truckload-delivery/set-status/${dispatchOrder}`,
			{ status },
			{
				headers: {
					[RequestHeaders.OTP]: otp
				}
			}
		)
	}
}
