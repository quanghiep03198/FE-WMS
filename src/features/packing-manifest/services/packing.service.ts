import axiosInstance from '@configs/axios.config'
import type { IPackingManifest } from '@features/packing-manifest/types'

export class PackingService {
	static async getPackingManifest() {
		return await axiosInstance.get<void, ResponseBody<IPackingManifest[]>>('/packing/manifest')
	}

	static async downloadPackingManifest() {
		return await axiosInstance.get<void, Blob>('/packing/manifest/export', {
			responseType: 'blob'
		})
	}

	static async bulkUpdatePacking(payload: { po: string; size: string; actual_weight_in: number }) {
		return await axiosInstance.patch('/packing/manifest', payload)
	}
}
