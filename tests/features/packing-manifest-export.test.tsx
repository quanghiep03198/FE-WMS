import DownloadExcelButton from '@features/packing-manifest/components/download-excel-button'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
	result: {
		jobId: 'job-1',
		status: { status: 'processing', processedRows: 12, totalRows: 20 },
		expired: false,
		isRunning: true,
		start: vi.fn(),
		statusError: null,
		retryStatus: vi.fn(),
		download: vi.fn(),
		downloadUrl: 'https://api.example.test/job-1',
		createError: null as Error | null
	}
}))
vi.mock('@features/packing-manifest/hooks/use-export-packing-manifest', () => ({
	useExportPackingManifest: () => state.result
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('@components/ui/icon', () => ({ Icon: ({ name }: { name: string }) => <span data-testid='icon'>{name}</span> }))

describe('packing manifest export', () => {
	it('shows a loading icon without content below the button and prevents concurrent exports', () => {
		render(
			<React.StrictMode>
				<DownloadExcelButton filters={{}} />
			</React.StrictMode>
		)
		expect(screen.getByTestId('icon')).toHaveTextContent('LoaderCircle')
		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
		expect(screen.queryByText('ns_packing:manifest.processing')).not.toBeInTheDocument()
		expect(screen.getByRole('button')).toBeDisabled()
		fireEvent.click(screen.getByRole('button'))
		expect(state.result.start).not.toHaveBeenCalled()
	})

	it('returns to the download icon when the job finishes', () => {
		state.result.status.status = 'done'
		state.result.isRunning = false
		render(
			<React.StrictMode>
				<DownloadExcelButton filters={{}} />
			</React.StrictMode>
		)
		expect(screen.getByTestId('icon')).toHaveTextContent('Download')
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})
})
