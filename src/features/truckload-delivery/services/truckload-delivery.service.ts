import axiosInstance from '@configs/axios.config'
import type { TruckloadDeliveryStatus } from '@features/truckload-delivery/constants'
import type { SignatureType } from '@features/truckload-delivery/contexts/page-context'
import type {
	CreateDeliveryFormValues,
	UpdateDispatchOrderFormValues,
	UpsertPurchaseOrdersFormValues
} from '@features/truckload-delivery/schemas'
import type { ITruckloadDelivery, ITruckloadDeliveryPacking, TruckloadDeliveryDispatchOrder } from '../types'

export class TruckloadDeliveryService {
	static async getDispatchOrders(
		queries: {
			from?: Date | string
			to?: Date | string
			status?: TruckloadDeliveryStatus
		} & Pick<Pagination, 'page' | 'limit'>
	) {
		return await axiosInstance.get<void, ResponseBody<Pagination<ITruckloadDelivery>>>('/truckload-delivery', {
			params: queries
		})
	}

	public static async getDispatchOrderDetail(dispatchOrder: string) {
		return await axiosInstance.get<void, ResponseBody<ITruckloadDeliveryPacking[]>>(
			`/truckload-delivery/${dispatchOrder}`
		)
	}

	static async insertMany(payload: CreateDeliveryFormValues) {
		return await axiosInstance.post<unknown, CreateDeliveryFormValues>('/truckload-delivery/create', payload)
	}

	static async deleteOne({ dispatch_order, po }: { dispatch_order: TruckloadDeliveryDispatchOrder; po: string }) {
		return await axiosInstance.delete<void, unknown>(
			`/truckload-delivery/delete/${dispatch_order}/purchase-orders/${po}`
		)
	}

	static async bulkUpdate(
		dispatchOrder: TruckloadDeliveryDispatchOrder,
		payload: Omit<Partial<UpdateDispatchOrderFormValues>, 'dispatch_order'>
	) {
		return await axiosInstance.patch(`/truckload-delivery/bulk-update/${dispatchOrder}`, payload)
	}

	static async searchDispatchPurchaseOrder(search: string) {
		return await axiosInstance.get<
			unknown,
			ResponseBody<
				Pick<
					ITruckloadDeliveryPacking,
					'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
				>[]
			>
		>(`truckload-delivery/search-dispatch-purchase-order`, { params: { search } })
	}

	static async upsertPurchaseOrders({ dispatch_order, ...update }: UpsertPurchaseOrdersFormValues) {
		return await axiosInstance.put(`/truckload-delivery/upsert-purchase-orders/${dispatch_order}`, update)
	}

	static async bulkDelete(dispatchOrder: TruckloadDeliveryDispatchOrder) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/bulk-delete/${dispatchOrder}`)
	}

	static async updateContainerCondition({
		dispatch_order,
		...update
	}: {
		dispatch_order: TruckloadDeliveryDispatchOrder
		punctured_container?: boolean
		smelling_container?: boolean
		moist_container?: boolean
	}) {
		return await axiosInstance.patch(`/truckload-delivery/update-container-condition/${dispatch_order}`, update)
	}

	static async updateDispatchOrderSignature({
		dispatch_order,
		...payload
	}: {
		dispatch_order: TruckloadDeliveryDispatchOrder
		signature_type: SignatureType
		approval_status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
		signature: string
	}) {
		return await axiosInstance.patch(`/truckload-delivery/update-signature/${dispatch_order}`, payload)
	}

	static async downloadExcel(params: { status?: TruckloadDeliveryStatus; from?: Date | string; to?: Date | string }) {
		return await axiosInstance.get<void, Blob>('/truckload-delivery/export', {
			params,
			responseType: 'blob'
		})
	}
}
