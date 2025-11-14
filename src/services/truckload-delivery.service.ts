import { TruckloadDeliveryStatus } from '@/app/(features)/_layout.truckload-delivery/-constants'
import {
	CreateTruckloadDeliveryFormValues,
	UpdateTruckloadDeliveryFormValues
} from '@/app/(features)/_layout.truckload-delivery/-schemas'
import { IBaseEntity } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

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
		return await axiosInstance.get<void, ITruckloadDelivery[]>('/truckload-delivery')
	}

	static async createOne(payload: CreateTruckloadDeliveryFormValues) {
		return await axiosInstance.post<unknown, CreateTruckloadDeliveryFormValues>('/truckload-delivery', payload)
	}

	static async updateOneById(id: number, payload: UpdateTruckloadDeliveryFormValues) {
		return await axiosInstance.patch(`/truckload-delivery/${id}`, payload)
	}

	static async deleteOne(id: number, shouldPermanentlyDelete?: true) {
		return await axiosInstance.delete<void, unknown>(`/truckload-delivery/${id}`, {
			params: { permanently: shouldPermanentlyDelete }
		})
	}

	static async deleteMany(ids: number[]) {
		return await axiosInstance.post<unknown, unknown, number[]>(`/truckload-delivery/delete-multiple`, ids)
	}

	static async restoreOneById(id: number) {
		return await axiosInstance.post<unknown, unknown, void>(`/truckload-delivery/restore/${id}`)
	}

	static async restoreMany(ids: number[]) {
		return await axiosInstance.post<unknown, unknown, number[]>(`/truckload-delivery/restore-multiple`, ids)
	}
}
