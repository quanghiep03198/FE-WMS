import { useExportPackingManifest } from '@features/packing-manifest/hooks/use-export-packing-manifest'
import { queryClient } from '@integrations/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { toast, Toaster } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({ create: vi.fn(), status: vi.fn() }))
vi.mock('@i18n/index', () => ({ i18n: { t: (key: string) => key } }))
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => (key === 'ns_packing:manifest.retry_download' ? 'Download' : key) })
}))
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

function ExportControl() {
	const { start, retryStatus } = useExportPackingManifest({})
	return (
		<>
			<button onClick={() => void start()}>Start</button>
			<button onClick={() => void retryStatus()}>Refresh</button>
		</>
	)
}

afterEach(() => {
	act(() => {
		toast.dismiss()
	})
	queryClient.clear()
	sessionStorage.clear()
	vi.restoreAllMocks()
})

describe('visible export toast', () => {
	it('replaces progress with a single success toast and Download action', async () => {
		sessionStorage.clear()
		api.create.mockResolvedValue({ jobId: 'visible-job' })
		api.status.mockResolvedValue({ status: 'processing', processedRows: 12, totalRows: 20 })
		vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
		render(
			<React.StrictMode>
				<QueryClientProvider client={queryClient}>
					<ExportControl />
					<Toaster />
				</QueryClientProvider>
			</React.StrictMode>
		)
		await act(async () => {
			screen.getByText('Start').click()
		})
		await screen.findByText('ns_packing:manifest.processing: 60%')
		expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(1)
		api.status.mockResolvedValue({ status: 'done', processedRows: 20, totalRows: 20 })
		await act(async () => {
			screen.getByText('Refresh').click()
		})
		await screen.findByText('ns_packing:manifest.ready')
		expect(screen.getByText('Download')).toBeInTheDocument()
		await waitFor(() => expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(1))
		expect(screen.queryByText('ns_common:notification.success')).not.toBeInTheDocument()
		expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1)
		api.create.mockResolvedValue({ jobId: 'next-job' })
		api.status.mockResolvedValue({ status: 'pending', processedRows: 0, totalRows: 0 })
		await act(async () => {
			screen.getByText('Start').click()
		})
		await screen.findByText('ns_packing:manifest.pending')
		await waitFor(() => expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(1))
		expect(screen.queryByText('ns_packing:manifest.ready')).not.toBeInTheDocument()
	})
})
