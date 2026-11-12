import { PackingService } from '@features/packing-manifest/services/packing.service'
import { describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('@configs/axios.config', () => ({ default: api }))
vi.mock('@configs/app.config', () => ({ AppConfigs: { BASE_API_URL: '/api' } }))
vi.mock('@i18n/index', () => ({ i18n: { resolvedLanguage: 'en' } }))

describe('packing manifest service', () => {
	it('maps shared pagination and conventional query parameters without changing the table contract', async () => {
		api.get.mockResolvedValue({ data: [{ po: 'PO' }], totalDocs: 25, page: 2, limit: 20 })
		const result = await PackingService.getPackingManifestPage({
			page: 2,
			pageSize: 20,
			po: 'A',
			standard_weightFrom: 1,
			sortBy: 'po',
			sortOrder: 'DESC'
		})
		expect(api.get).toHaveBeenCalledWith(
			'/packing-manifest',
			expect.objectContaining({
				params: { _page: 2, _limit: 20, _sort: 'po', _order: 'desc', 'po:contains': 'A', 'standard_weight:gte': 1 }
			})
		)
		expect(result).toEqual({ items: [{ po: 'PO' }], total: 25, page: 2, pageSize: 20 })
	})
})
