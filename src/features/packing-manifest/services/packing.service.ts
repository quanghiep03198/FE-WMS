import { AppConfigs } from '@configs/app.config'
import axiosInstance from '@configs/axios.config'
import type { ManifestExportStatus, PackingManifestPage, PackingManifestRow } from '@features/packing-manifest/types'
import type { ManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { i18n } from '@i18n/index'

export class PackingService {
	static async getPackingManifestPage(params: ManifestFilters & { page: number; pageSize: number }) {
		const query: Record<string, string | number> = { _page: params.page, _limit: params.pageSize }
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || key === 'page' || key === 'pageSize') continue
			if (key === 'sortBy') query._sort = value
			else if (key === 'sortOrder') query._order = value.toString().toLowerCase()
			else if (key.endsWith('From')) query[`${key.slice(0, -4)}:gte`] = value
			else if (key.endsWith('To')) query[`${key.slice(0, -2)}:lte`] = value
			else query[`${key}:contains`] = value
		}
		const result = await axiosInstance.get<
			void,
			{ data: PackingManifestRow[]; totalDocs: number; page: number; limit: number }
		>('/packing-manifest', {
			params: query,
			headers: { 'X-Api-Version': '2' }
		})
		return {
			items: result.data,
			total: result.totalDocs,
			page: result.page,
			pageSize: result.limit
		} satisfies PackingManifestPage
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

	static async bulkUpdatePacking(payload: { po: string; size: string; actual_weight_in: number }) {
		return await axiosInstance.patch('/packing/manifest', payload)
	}
}
