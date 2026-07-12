import axiosInstance from '@configs/axios.config'
import { omit } from 'lodash-es'
import type { CreateRFIDReaderFormValues, UpdateRFIDReaderFormValues } from '../schemas/rfid-device.schema'
import type { IRFIDReaderDevice } from '../types'

export class RFIDDeviceService {
	static async getWarehouseRFIDDevices() {
		return await axiosInstance.get<unknown, ResponseBody<IRFIDReaderDevice[]>>(`/rfid/devices`)
	}

	static async createWarehouseRFIDDevice(payload: CreateRFIDReaderFormValues) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, CreateRFIDReaderFormValues>(
			'/rfid/devices/create',
			payload
		)
	}

	static async updateWarehouseRFIDDevice(payload: UpdateRFIDReaderFormValues) {
		return await axiosInstance.patch<unknown, ResponseBody<unknown>, UpdateRFIDReaderFormValues>(
			`/rfid/devices/update/${payload.device_sn}`,
			omit(payload, ['device_sn'])
		)
	}

	static async deleteWarehouseRFIDDevice(deviceSeriesNumbers: string[]) {
		return await axiosInstance.post<unknown, ResponseBody<unknown>, string[]>(
			`/rfid/devices/delete`,
			deviceSeriesNumbers
		)
	}
}
