import { useExportPackingManifest } from '@features/packing-manifest/hooks/use-export-packing-manifest'
import { usePackingManifestList } from '@features/packing-manifest/hooks/use-packing-manifest-list'
import cn from '@i18n/cn/ns_packing.i18n'
import en from '@i18n/en/ns_packing.i18n'
import viLocale from '@i18n/vi/ns_packing.i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { AxiosError } from 'axios'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({
	list: vi.fn(),
	create: vi.fn(),
	status: vi.fn(),
	downloadUrl: vi.fn((id: string) => `https://api.example.test/${id}`),
	update: vi.fn()
}))
const notifications = vi.hoisted(() => ({ loading: vi.fn(), success: vi.fn(), error: vi.fn(), dismiss: vi.fn() }))
vi.mock('sonner', () => ({ toast: notifications }))

vi.mock('@features/packing-manifest/services/packing.service', () => ({
	PackingService: {
		getPackingManifestPage: api.list,
		createManifestExport: api.create,
		getManifestExportStatus: api.status,
		manifestExportDownloadUrl: api.downloadUrl,
		bulkUpdatePacking: api.update
	}
}))
vi.mock('@features/auth/services/auth.service', () => ({
	AuthService: { getCredentials: () => ({ username: 'test-user' }) }
}))
vi.mock('@common/utils/env', () => ({ default: () => 'VA1' }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

function wrapper({ children }: PropsWithChildren) {
	const [client] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

import React from 'react'

beforeEach(() => {
	vi.resetAllMocks()
	sessionStorage.clear()
	vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
	api.list.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 })
	api.downloadUrl.mockImplementation((id) => `https://api.example.test/${id}`)
})
afterEach(() => vi.restoreAllMocks())

describe('packing manifest hooks', () => {
	it('resets the page on sort and sends server parameters', async () => {
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		await waitFor(() => expect(api.list).toHaveBeenCalled())
		act(() => result.current.onPaginationChange({ pageIndex: 2, pageSize: 20 }))
		await waitFor(() => expect(api.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })))
		act(() => result.current.onSortingChange([{ id: 'po', desc: true }]))
		await waitFor(() =>
			expect(api.list).toHaveBeenLastCalledWith(
				expect.objectContaining({ page: 1, sortBy: 'po', sortOrder: 'DESC' })
			)
		)
	})

	it('restores a running export and stops polling after completion', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-1')
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(result.current.status?.status).toBe('done'))
		expect(result.current.jobId).toBe('job-1')
		expect(api.status).toHaveBeenCalledWith('job-1')
		await waitFor(() => expect(result.current.isRunning).toBe(false))
	})

	it('automatically starts a direct download once per job across reloads', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-auto')
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		const click = vi.mocked(HTMLAnchorElement.prototype.click)
		const first = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(click).toHaveBeenCalledTimes(1))
		first.rerender()
		first.unmount()
		renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(api.status).toHaveBeenCalledTimes(3))
		expect(click).toHaveBeenCalledTimes(1)
		expect(notifications.success).toHaveBeenCalled()
	})

	it('automatically downloads once under React StrictMode', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-strict')
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		const strictWrapper = ({ children }: PropsWithChildren) => (
			<React.StrictMode>{wrapper({ children })}</React.StrictMode>
		)
		renderHook(() => useExportPackingManifest({}), { wrapper: strictWrapper })
		await waitFor(() => expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1))
		expect(api.downloadUrl).toHaveBeenCalledWith('job-strict')
	})

	it('updates a single progress toast without dividing by zero', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-progress')
		api.status.mockResolvedValue({ status: 'processing', processedRows: 12, totalRows: 20 })
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() =>
			expect(notifications.loading).toHaveBeenCalledWith(
				expect.stringContaining('60%'),
				expect.objectContaining({ id: expect.any(String) })
			)
		)
		api.status.mockResolvedValue({ status: 'processing', processedRows: 12, totalRows: 0 })
		await act(async () => {
			await result.current.retryStatus()
		})
		await waitFor(() =>
			expect(notifications.loading).toHaveBeenLastCalledWith(
				expect.not.stringContaining('%'),
				expect.objectContaining({ id: expect.any(String) })
			)
		)
		const ids = notifications.loading.mock.calls.map(([, options]) => options.id)
		expect(new Set(ids)).toEqual(new Set(['packing-manifest-export:VA1:test-user']))
	})

	it('clamps progress and starts the cookie-authenticated download on completion', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-transition')
		api.status.mockResolvedValue({ status: 'processing', processedRows: 25, totalRows: 20 })
		let downloadHref = ''
		vi.mocked(HTMLAnchorElement.prototype.click).mockImplementation(function (this: HTMLAnchorElement) {
			downloadHref = this.href
		})
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() =>
			expect(notifications.loading).toHaveBeenCalledWith(
				expect.stringContaining('100%'),
				expect.objectContaining({ id: 'packing-manifest-export:VA1:test-user' })
			)
		)
		api.status.mockResolvedValue({ status: 'done', processedRows: 20, totalRows: 20 })
		await act(async () => {
			await result.current.retryStatus()
		})
		await waitFor(() => expect(downloadHref).toBe('https://api.example.test/job-transition'))
		await waitFor(() =>
			expect(notifications.success).toHaveBeenCalledWith(
				'ns_packing:manifest.ready',
				expect.objectContaining({ id: 'packing-manifest-export:VA1:test-user' })
			)
		)
	})

	it.each([
		['Vietnamese', viLocale],
		['English', en],
		['Chinese', cn]
	])('provides all export toast messages in %s', (_language, locale) => {
		for (const key of [
			'pending',
			'processing',
			'ready',
			'retry_download',
			'failed',
			'expired',
			'status_error',
			'retry',
			'too_many',
			'create_error'
		] as const) {
			expect(locale.manifest[key].trim()).not.toBe('')
		}
	})

	it('uses short translated download labels', () => {
		expect(viLocale.manifest.retry_download).toBe('Tải xuống')
		expect(en.manifest.retry_download).toBe('Download')
		expect(cn.manifest.retry_download).toBe('下载')
	})

	it('does not continue polling a completed export', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'completed-job')
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(result.current.status?.status).toBe('done'))
		await new Promise((resolve) => setTimeout(resolve, 2200))
		expect(api.status).toHaveBeenCalledTimes(2)
	})

	it('does not navigate on a failed status recheck even when cached data says done', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-1')
		api.status.mockResolvedValueOnce({ status: 'done', processedRows: 10, totalRows: 10 })
		api.status.mockRejectedValue(new Error('network error'))
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(result.current.statusError).toBeTruthy())
		expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled()
		expect(notifications.error).toHaveBeenCalledWith(
			'ns_packing:manifest.status_error',
			expect.objectContaining({ action: expect.objectContaining({ label: 'ns_packing:manifest.retry' }) })
		)
	})

	it.each([409, 429])('reports export concurrency error %s in the toast', async (code) => {
		api.create.mockRejectedValue(
			new AxiosError('busy', undefined, undefined, undefined, {
				status: code,
				statusText: 'Busy',
				data: null,
				headers: {},
				config: { headers: {} }
			} as never)
		)
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await act(async () => {
			await result.current.start()
		})
		expect(notifications.error).toHaveBeenCalledWith('ns_packing:manifest.too_many', expect.any(Object))
	})

	it('keeps a creation error visible after an earlier export completed', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'old-job')
		sessionStorage.setItem('packing-manifest-export:VA1:test-user:downloaded', 'old-job')
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		api.create.mockRejectedValue(
			new AxiosError('busy', undefined, undefined, undefined, {
				status: 429,
				statusText: 'Busy',
				data: null,
				headers: {},
				config: { headers: {} }
			} as never)
		)
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(notifications.success).toHaveBeenCalled())
		await act(async () => {
			await result.current.start()
		})
		await waitFor(() =>
			expect(notifications.error).toHaveBeenLastCalledWith('ns_packing:manifest.too_many', expect.any(Object))
		)
		expect(notifications.loading.mock.invocationCallOrder.at(-1) ?? 0).toBeLessThan(
			notifications.error.mock.invocationCallOrder.at(-1) ?? 0
		)
		expect(notifications.success.mock.invocationCallOrder.at(-1) ?? 0).toBeLessThan(
			notifications.error.mock.invocationCallOrder.at(-1) ?? 0
		)
	})

	it('shows backend failure details in the existing toast', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'job-failed')
		api.status.mockResolvedValue({
			status: 'failed',
			processedRows: 2,
			totalRows: 10,
			error: 'Export failed on server'
		})
		renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() =>
			expect(notifications.error).toHaveBeenCalledWith(
				'ns_packing:manifest.failed',
				expect.objectContaining({
					description: 'Export failed on server',
					id: 'packing-manifest-export:VA1:test-user'
				})
			)
		)
	})

	it('keeps the previous page visible while the next page is loading', async () => {
		api.list.mockResolvedValueOnce({ items: [{ po: 'first-page' }], total: 100, page: 1, pageSize: 20 })
		api.list.mockImplementationOnce(() => new Promise(() => {}))
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		await waitFor(() => expect(result.current.data?.items[0]?.po).toBe('first-page'))
		act(() => result.current.onPaginationChange({ pageIndex: 2, pageSize: 20 }))
		await waitFor(() => expect(result.current.isPlaceholderData).toBe(true))
		expect(result.current.data?.items[0]?.po).toBe('first-page')
	})

	it.each([404, 410])('clears and reports an expired job when status returns %s', async (statusCode) => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'missing-job')
		api.status.mockRejectedValue(
			new AxiosError('missing', undefined, undefined, undefined, {
				status: statusCode,
				statusText: 'Not Found',
				data: null,
				headers: {},
				config: { headers: {} }
			} as never)
		)
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() => expect(result.current.expired).toBe(true))
		expect(result.current.jobId).toBeNull()
		expect(sessionStorage.getItem('packing-manifest-export:VA1:test-user')).toBeNull()
		await waitFor(() =>
			expect(notifications.error).toHaveBeenCalledWith(
				'ns_packing:manifest.expired',
				expect.objectContaining({ id: 'packing-manifest-export:VA1:test-user' })
			)
		)
		expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled()
	})

	it('resets the page when filters change', async () => {
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		act(() => result.current.onPaginationChange({ pageIndex: 3, pageSize: 20 }))
		act(() => result.current.onColumnFiltersChange([{ id: 'po', value: 'ABC' }]))
		expect(result.current.pagination.page).toBe(1)
		await waitFor(() =>
			expect(api.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, pageSize: 20, po: 'ABC' }))
		)
	})

	it('prefetches exactly the next page using the current filters and sort, and not beyond the last page', async () => {
		api.list.mockImplementation(async (params: { page: number; pageSize: number }) => ({
			items: [],
			total: 21,
			page: params.page,
			pageSize: params.pageSize
		}))
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		act(() => result.current.onColumnFiltersChange([{ id: 'po', value: 'ABC' }]))
		act(() => result.current.onSortingChange([{ id: 'po', desc: true }]))
		await waitFor(() =>
			expect(api.list).toHaveBeenCalledWith({ page: 2, pageSize: 20, po: 'ABC', sortBy: 'po', sortOrder: 'DESC' })
		)
		expect(api.list).not.toHaveBeenCalledWith(expect.objectContaining({ page: 3 }))
	})

	it('uses the prefetched page without requesting it a second time', async () => {
		api.list.mockImplementation(async (params: { page: number; pageSize: number }) => ({
			items: [{ po: `page-${params.page}` }],
			total: 21,
			page: params.page,
			pageSize: params.pageSize
		}))
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		await waitFor(() => expect(api.list).toHaveBeenCalledWith({ page: 2, pageSize: 20 }))
		await waitFor(() => expect(api.list).toHaveResolvedTimes(2))
		act(() => result.current.onPaginationChange({ pageIndex: 2, pageSize: 20 }))
		await waitFor(() => expect(result.current.data?.items[0]?.po).toBe('page-2'))
		expect(api.list.mock.calls.filter(([params]) => params.page === 2)).toHaveLength(1)
	})

	it('updates a weight and refreshes the paginated list', async () => {
		api.update.mockResolvedValue({})
		const { result } = renderHook(() => usePackingManifestList(), { wrapper })
		await waitFor(() => expect(api.list).toHaveBeenCalledTimes(1))
		act(() => result.current.updateWeight({ po: 'PO', size: '#10(1)', actual_weight_in: 2 }))
		await waitFor(() => expect(api.update).toHaveBeenCalledWith({ po: 'PO', size: '#10(1)', actual_weight_in: 2 }))
		await waitFor(() => expect(api.list).toHaveBeenCalledTimes(2))
	})

	it('creates exports using only the applied filters and sort', async () => {
		api.create.mockResolvedValue({ jobId: 'job-2' })
		api.status.mockResolvedValue({ status: 'pending', processedRows: 0, totalRows: 10 })
		const filters = { po: 'ABC', sortBy: 'po', sortOrder: 'ASC' } as const
		const { result } = renderHook(() => useExportPackingManifest(filters), { wrapper })
		await act(async () => result.current.start())
		expect(api.create).toHaveBeenCalledWith(filters)
		await waitFor(() => expect(result.current.isRunning).toBe(true))
		expect(sessionStorage.getItem('packing-manifest-export:VA1:test-user')).toBe('job-2')
	})
})
