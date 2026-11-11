import { toManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { describe, expect, it } from 'vitest'

describe('packing manifest request filters', () => {
	it('maps text, numeric ranges and a single whitelisted sort to the API contract', () => {
		expect(
			toManifestFilters(
				[
					{ id: 'po', value: 'PO123' },
					{ id: 'standard_weight', value: ['0', '12.5'] }
				],
				[{ id: 'po', desc: true }]
			)
		).toEqual({ po: 'PO123', standard_weightFrom: 0, standard_weightTo: 12.5, sortBy: 'po', sortOrder: 'DESC' })
	})

	it('ignores empty filters and fields outside the backend whitelist', () => {
		expect(
			toManifestFilters(
				[
					{ id: 'po', value: '' },
					{ id: 'standard_weight', value: ['', ''] },
					{ id: 'unknown', value: 'x' }
				],
				[{ id: 'unknown', desc: false }]
			)
		).toEqual({})
	})
})
