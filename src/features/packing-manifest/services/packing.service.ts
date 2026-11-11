import { AppConfigs } from '@configs/app.config'
import axiosInstance from '@configs/axios.config'
import type { IPackingManifest, ManifestExportStatus, PackingManifestPage } from '@features/packing-manifest/types'
import type { ManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { i18n } from '@i18n/index'

export class PackingService {
	static async getPackingManifestPage(params: ManifestFilters & { page: number; pageSize: number }) {
		return await axiosInstance.get<void, PackingManifestPage>('/packing-manifest', {
			params,
			headers: { 'X-Api-Version': '2' }
		})
	}

	static async createManifestExport(filters: ManifestFilters) {
		return await axiosInstance.post<ManifestFilters, { jobId: string }>('/packing-manifest/exports', filters, {
			headers: { 'X-Api-Version': '2', 'X-Language': i18n.resolvedLanguage ?? 'en' }
		})
	}

	static async getManifestExportStatus(jobId: string) {
		return await axiosInstance.get<void, ManifestExportStatus>(
			`/packing-manifest/exports/${encodeURIComponent(jobId)}`,
			{
				headers: { 'X-Api-Version': '2' }
			}
		)
	}

	static manifestExportDownloadUrl(jobId: string) {
		return `${AppConfigs.BASE_API_URL.replace(/\/$/, '')}/packing-manifest/exports/${encodeURIComponent(jobId)}/download`
	}

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
