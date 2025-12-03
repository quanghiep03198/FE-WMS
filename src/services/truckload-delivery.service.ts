import { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import {
	CreateDeliveryFormValues,
	UpdateDispatchOrderFormValues,
	UpsertPurchaseOrdersFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
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
	security_name_reviewed: string
	security_code_reviewed: string
	punctured_container: boolean
	smelling_container: boolean
	moist_container: boolean
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

export type QrCodeScannedResult = {
	employee_code: string
	employee_name_show: string
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

	static async updateContainerCondition({ dispatch_order, ...update }) {
		return await axiosInstance.patch(`/truckload-delivery/update-container-condition/${dispatch_order}`, update)
	}

	static async updateDispatchOrderSignature({
		dispatch_order,
		...payload
	}: {
		dispatch_order: TruckloadDeliveryDispatchOrder
		signature_type: 'qc_signature' | 'warehouse_officer_signature' | 'security_guard_signature'
		approval_status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
		signature: string
	}) {
		return await axiosInstance.patch(`/truckload-delivery/update-signature/${dispatch_order}`, payload)
	}

	static async downloadExcel() {
		return await axiosInstance.get<void, Blob>('/truckload-delivery/export', {
			responseType: 'blob'
		})
	}
}
