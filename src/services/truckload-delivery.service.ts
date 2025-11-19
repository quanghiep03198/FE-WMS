import { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import {
	CreateDeliveryFormValues,
	UpdateDeliveryFormValues,
	UpdateDispatchOrderFormValues,
	UpsertPurchaseOrdersFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
import { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type TruckloadDeliveryDispatchOrder = `DO-${string}-${string}`

export interface ITruckloadDelivery extends IBaseEntity {
	dispatch_order: TruckloadDeliveryDispatchOrder
	factory_code: string
	license_plate: string
	factory_departure_time: string
	outbound_qty: number
	status: TruckloadDeliveryStatus
	delivery_details: Array<{
		id?: number | null
		po: string
		brand_name: string
		factory_shoes_style: string
		color_sn: string
		outbound_qty: number
	}>
}

export class TruckloadDeliveryService {
	static async getAll() {
		return await axiosInstance.get<void, ResponseBody<ITruckloadDelivery[]>>('/truckload-delivery')
	}

	static async insertMany(payload: CreateDeliveryFormValues) {
		return await axiosInstance.post<unknown, CreateDeliveryFormValues>('/truckload-delivery/create', payload)
	}

	static async updateOneById(id: number, payload: Omit<UpdateDeliveryFormValues, 'id'>) {
		return await axiosInstance.patch(`/truckload-delivery/update/${id}`, payload)
	}

	static async deleteOne(id: number, shouldPermanentlyDelete?: true) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/delete/${id}`, {
			params: { permanently: shouldPermanentlyDelete }
		})
	}

	static async bulkUpdate(dispatchOrder: string, payload: Omit<UpdateDispatchOrderFormValues, 'dispatch_order'>) {
		return await axiosInstance.patch(`/truckload-delivery/bulk-update/${dispatchOrder}`, payload)
	}

	static async upsertPurchaseOrders({ dispatch_order, ...update }: UpsertPurchaseOrdersFormValues) {
		return await axiosInstance.put(`/truckload-delivery/upsert-purchase-orders/${dispatch_order}`, update)
	}

	static async setStatusById(
		dispatchOrder: TruckloadDeliveryDispatchOrder,
		status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	) {
		return await axiosInstance.patch(`/truckload-delivery/set-status/${dispatchOrder}`, { status })
	}

	static async restoreOneById(id: number) {
		return await axiosInstance.post<unknown, unknown, void>(`/truckload-delivery/restore/${id}`)
	}

	static async restoreMany(ids: number[]) {
		return await axiosInstance.post<unknown, unknown, number[]>(`/truckload-delivery/restore-multiple`, ids)
	}
}
