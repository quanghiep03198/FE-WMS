import { useExportPackingManifest } from '@features/packing-manifest/hooks/use-export-packing-manifest'
import { queryClient } from '@integrations/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { AxiosError } from 'axios'
import React, { type PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({ create: vi.fn(), status: vi.fn() }))
const notifications = vi.hoisted(() => ({ loading: vi.fn(), success: vi.fn(), error: vi.fn(), dismiss: vi.fn() }))
vi.mock('sonner', () => ({ toast: notifications }))
vi.mock('@i18n/index', () => ({ i18n: { t: (key: string) => key } }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('@tanstack/query-broadcast-client-experimental', () => ({ broadcastQueryClient: vi.fn() }))
vi.mock('@features/auth/services/auth.service', () => ({
	AuthService: { getCredentials: () => ({ username: 'test-user' }) }
}))
vi.mock('@common/utils/env', () => ({ default: () => 'VA1' }))
vi.mock('@features/packing-manifest/services/packing.service', () => ({
	PackingService: {
		createManifestExport: api.create,
		getManifestExportStatus: api.status,
		manifestExportDownloadUrl: (id: string) => `https://api.example.test/${id}`
	}
}))

function wrapper({ children }: PropsWithChildren) {
	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</React.StrictMode>
	)
}

beforeEach(() => {
	queryClient.clear()
	sessionStorage.clear()
	vi.clearAllMocks()
	vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('export toast integration', () => {
	it('downloads an immediately ready file without a loading or generic success toast', async () => {
		api.create.mockResolvedValue({ jobId: 'immediate-job' })
		api.status.mockResolvedValue({ status: 'done', processedRows: 10, totalRows: 10 })
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await act(async () => {
			await result.current.start()
		})
		await waitFor(() => expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1))
		await waitFor(() =>
			expect(notifications.success).toHaveBeenCalledWith(
				'ns_packing:manifest.ready',
				expect.objectContaining({
					action: expect.objectContaining({ label: 'ns_packing:manifest.retry_download' })
				})
			)
		)
		expect(notifications.loading).not.toHaveBeenCalled()
		expect(notifications.success).not.toHaveBeenCalledWith('ns_common:notification.success')
	})

	it('only shows loading once the backend reports a pending job', async () => {
		api.create.mockResolvedValue({ jobId: 'waiting-job' })
		let resolveStatus: ((value: { status: string; processedRows: number; totalRows: number }) => void) | undefined
		api.status.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolveStatus = resolve
				})
		)
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await act(async () => {
			await result.current.start()
		})
		await waitFor(() => expect(api.status).toHaveBeenCalled())
		expect(notifications.loading).not.toHaveBeenCalled()
		expect(notifications.success).not.toHaveBeenCalled()
		await act(async () => {
			resolveStatus?.({ status: 'pending', processedRows: 0, totalRows: 0 })
		})
		await waitFor(() =>
			expect(notifications.loading).toHaveBeenCalledWith(
				'ns_packing:manifest.pending',
				expect.objectContaining({ id: 'packing-manifest-export:VA1:test-user' })
			)
		)
	})

	it('shows one specific error rather than a global mutation error for export failures', async () => {
		api.create.mockRejectedValue(
			new AxiosError('busy', undefined, undefined, undefined, {
				status: 429,
				statusText: 'Busy',
				data: { message: 'Backend busy' },
				headers: {},
				config: { headers: {} }
			} as never)
		)
		const { result } = renderHook(() => useExportPackingManifest({}), { wrapper })
		await act(async () => {
			await result.current.start()
		})
		await waitFor(() =>
			expect(notifications.error).toHaveBeenCalledWith(
				'ns_packing:manifest.too_many',
				expect.objectContaining({ id: 'packing-manifest-export:VA1:test-user' })
			)
		)
		expect(notifications.error).not.toHaveBeenCalledWith('Backend busy')
	})

	it('shows only the export-specific error when status polling times out', async () => {
		sessionStorage.setItem('packing-manifest-export:VA1:test-user', 'timeout-job')
		api.status.mockRejectedValue(new AxiosError('timeout', AxiosError.ETIMEDOUT))
		renderHook(() => useExportPackingManifest({}), { wrapper })
		await waitFor(() =>
			expect(notifications.error).toHaveBeenCalledWith('ns_packing:manifest.status_error', expect.any(Object))
		)
		expect(notifications.error).not.toHaveBeenCalledWith('ns_common:errors.request_timeout')
	})

	it('retains the default global success toast for unrelated mutations', async () => {
		const mutation = queryClient.getMutationCache().build(queryClient, { mutationFn: async () => 'ok' })
		await act(async () => {
			await mutation.execute(undefined)
		})
		expect(notifications.success).toHaveBeenCalledWith('ns_common:notification.success')
	})

	it('still invalidates queries when mutation notifications are suppressed', async () => {
		queryClient.setQueryData(['test-invalidation'], 'cached')
		const mutation = queryClient.getMutationCache().build(queryClient, {
			mutationFn: async () => 'ok',
			meta: { invalidates: [['test-invalidation']], suppressNotifications: true }
		})
		await act(async () => {
			await mutation.execute(undefined)
		})
		expect(queryClient.getQueryState(['test-invalidation'])?.isInvalidated).toBe(true)
		expect(notifications.success).not.toHaveBeenCalled()
	})

	it('retains the default global error toast for unrelated mutations', async () => {
		const error = new AxiosError('bad request', undefined, undefined, undefined, {
			status: 400,
			statusText: 'Bad Request',
			data: { message: 'Unrelated error' },
			headers: {},
			config: { headers: {} }
		} as never)
		const mutation = queryClient.getMutationCache().build(queryClient, {
			mutationFn: async () => {
				throw error
			}
		})
		await act(async () => {
			await expect(mutation.execute(undefined)).rejects.toBe(error)
		})
		expect(notifications.error).toHaveBeenCalledWith('Unrelated error')
	})

	it('retains global timeout reporting for unrelated queries', async () => {
		const error = new AxiosError('timeout', AxiosError.ETIMEDOUT)
		await expect(
			queryClient.fetchQuery({
				queryKey: ['unrelated-timeout'],
				queryFn: async () => {
					throw error
				},
				retry: false
			})
		).rejects.toBe(error)
		expect(notifications.error).toHaveBeenCalledWith('ns_common:errors.request_timeout')
	})
})
