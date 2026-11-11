import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import ReportMasterTable from '@features/packing-manifest/components/data-table'
import { usePackingManifestList } from '@features/packing-manifest/hooks/use-packing-manifest-list'

const mocks = vi.hoisted(() => ({ table: vi.fn(), list: vi.fn() }))
vi.mock('@components/addons/tanstack-table', () => ({
	default: (props: Record<string, unknown>) => {
		mocks.table(props)
		return <div data-testid='manifest-table' />
	}
}))
vi.mock('@features/packing-manifest/services/packing.service', () => ({
	PackingService: { getPackingManifestPage: mocks.list, bulkUpdatePacking: vi.fn() }
}))
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))

function TableWithList() {
	const list = usePackingManifestList()
	return <ReportMasterTable list={list} />
}

describe('packing manifest table', () => {
	it('uses server-side table modes with no page-size selector or additional column', async () => {
		mocks.list.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 })
		const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
		render(
			<QueryClientProvider client={client}>
				<TableWithList />
			</QueryClientProvider>
		)
		await waitFor(() => expect(mocks.list).toHaveBeenCalled())
		expect(mocks.table).toHaveBeenLastCalledWith(
			expect.objectContaining({
				manualPagination: true,
				manualSorting: true,
				manualFiltering: true,
				enableMultiSort: false,
				enableGlobalFilter: false
			})
		)
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
		const props = mocks.table.mock.lastCall?.[0]
		expect(props.paginationProps.limit).toBe(20)
		expect(props.columns.map((column: { accessorKey: string }) => column.accessorKey)).not.toContain('cust_shoes_style')
	})
})
