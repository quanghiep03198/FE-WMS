import type { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import type { SignatureType } from '@/app/(features)/_layout.truckload-delivery/-contexts/page-context'
import type {
	CreateDeliveryFormValues,
	UpdateDispatchOrderFormValues,
	UpsertPurchaseOrdersFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
import type { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

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

export type QrCodeScannedResult = {
	employee_code: string
	employee_name_show: string
}

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
		return await axiosInstance.get<void, ResponseBody<ITruckloadDeliveryDetail[]>>(
			`/truckload-delivery/${dispatchOrder}`
		)
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

	static async searchDispatchPurchaseOrder(search: string) {
		return await axiosInstance.get<
			void,
			ResponseBody<
				Pick<
					ITruckloadDeliveryDetail,
					'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
				>[]
			>
		>(`truckload-delivery/search-dispatch-purchase-order`, { params: { search } })
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
