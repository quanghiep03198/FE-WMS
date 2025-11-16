import { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import {
	CreateDeliveryFormValues,
	UpdateDeliveryFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
import { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { omit } from 'lodash'

export interface ITruckloadDelivery extends IBaseEntity {
	po: string
	license_plate: string
	factory_depature_date: Date
	factory_departure_time: string
	container_number: string
	outbound_qty: number
	status: TruckloadDeliveryStatus
}

export class TruckloadDeliveryService {
	static async getAll() {
		return await axiosInstance.get<void, ResponseBody<ITruckloadDelivery[]>>('/truckload-delivery')
	}

	static async insertMany(payload: CreateDeliveryFormValues) {
		return await axiosInstance.post<unknown, CreateDeliveryFormValues>(
			'/truckload-delivery/create',
			payload.outbound_purchase_orders.map((item) => omit(item, ['max_outbound_qty']))
		)
	}

	static async updateOneById(id: number, payload: Omit<UpdateDeliveryFormValues, 'id'>) {
		return await axiosInstance.patch(`/truckload-delivery/update/${id}`, payload)
	}

	static async deleteOne(id: number, shouldPermanentlyDelete?: true) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/delete/${id}`, {
			params: { permanently: shouldPermanentlyDelete }
		})
	}

	static async restoreOneById(id: number) {
		return await axiosInstance.post<unknown, unknown, void>(`/truckload-delivery/restore/${id}`)
	}

	static async restoreMany(ids: number[]) {
		return await axiosInstance.post<unknown, unknown, number[]>(`/truckload-delivery/restore-multiple`, ids)
	}
}
