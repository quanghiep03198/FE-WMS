import { RetriableError } from '@common/errors'
import ConnectButton from '@features/finished-goods/components/finished-goods-inbound/toolbar/connect-button'
import { usePageContext } from '@features/finished-goods/contexts/finished-goods-inbound/page-context'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Route } from '../../src/routes/(features)/_layout/(finished-goods)/finished-goods-inbound.lazy'

const mocks = vi.hoisted(() => ({ fetchEventSource: vi.fn() }))

vi.mock('@tanstack/react-router', () => ({
	createLazyFileRoute: () => (options: unknown) => ({ options })
}))
vi.mock('@contexts/breadcrumb-context', () => ({ useBreadcrumbContext: () => ({ setBreadcrumb: vi.fn() }) }))
vi.mock('@components/guards/role-guard', () => ({ RoleGuard: ({ children }: React.PropsWithChildren) => children }))
vi.mock('@stores/socket.store', () => ({ SocketProvider: ({ children }: React.PropsWithChildren) => children }))
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
vi.mock('@features/finished-goods/components/finished-goods-inbound/already-scanned-epcs-alert', () => ({
	default: () => null
}))
vi.mock('@features/finished-goods/components/finished-goods-inbound/epc-counter', () => ({ default: () => null }))
vi.mock('@features/finished-goods/components/finished-goods-inbound/inoutbound-form', () => ({ default: () => null }))
vi.mock('@features/finished-goods/components/finished-goods-inbound/remind-message', () => ({ default: () => null }))
vi.mock('@features/finished-goods/components/finished-goods-inbound/side-toolbar', () => ({ default: () => null }))
vi.mock('@features/finished-goods/components/finished-goods-inbound/toolbar', () => ({
	default: () => <TestToolbar />
}))
vi.mock('@features/finished-goods/components/finished-goods-inbound/manufacturing-order-detail', () => ({
	default: () => null
}))
vi.mock('@features/finished-goods/components/upload-data-dialog', () => ({ default: () => null }))
vi.mock('@features/finished-goods/components/finished-goods-inbound/epc-data-list/order-list-select', () => ({
	default: () => null
}))
vi.mock('@features/finished-goods/hooks/use-inbound-request', () => ({
	useGetScanningInboundEpcQuery: () => ({ refetch: vi.fn(), isFetching: false })
}))
vi.mock('@features/auth/services/auth.service', () => ({ AuthService: { refreshToken: vi.fn() } }))
vi.mock('@common/utils/env', () => ({ default: () => 'test' }))
vi.mock('@microsoft/fetch-event-source', () => ({
	EventStreamContentType: 'text/event-stream',
	fetchEventSource: mocks.fetchEventSource
}))
vi.mock('sonner', () => ({
	toast: Object.assign(vi.fn(), {
		loading: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		dismiss: vi.fn(),
		custom: vi.fn()
	})
}))

function TestToolbar() {
	const { setSelectedDevice } = usePageContext('setSelectedDevice')
	return (
		<>
			<button onClick={() => setSelectedDevice('reader-1')}>Select reader</button>
			<ConnectButton />
		</>
	)
}

function renderPage() {
	const Page = Route.options.component
	if (!Page) throw new Error('Inbound page component is not defined')
	return render(<Page />)
}

describe('finished goods inbound connection', () => {
	beforeEach(() => {
		mocks.fetchEventSource.mockReset()
		mocks.fetchEventSource.mockImplementation(
			(_url: string, options: { signal: AbortSignal }) =>
				new Promise<void>((resolve) => options.signal.addEventListener('abort', () => resolve()))
		)
	})

	it('opens one SSE connection when the connect button is clicked', async () => {
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Select reader' }))
		fireEvent.click(screen.getByRole('button', { name: 'ns_common:actions.connect' }))

		await waitFor(() => expect(mocks.fetchEventSource).toHaveBeenCalledTimes(1))
		expect(mocks.fetchEventSource.mock.calls[0][1].headers).toEqual(
			expect.objectContaining({ 'X-Reader-Id': 'reader-1' })
		)
	})

	it('lets the existing SSE request handle retries after a connection error', async () => {
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Select reader' }))
		fireEvent.click(screen.getByRole('button', { name: 'ns_common:actions.connect' }))
		await waitFor(() => expect(mocks.fetchEventSource).toHaveBeenCalledTimes(1))

		const options = mocks.fetchEventSource.mock.calls[0][1]
		await act(async () => {
			await options.onopen(new Response(null, { headers: { 'content-type': 'text/event-stream' } }))
		})
		expect(screen.getByRole('button', { name: 'ns_common:actions.disconnect' })).toBeInTheDocument()

		act(() => options.onerror(new RetriableError('connection interrupted')))
		await waitFor(() => expect(screen.getByRole('button', { name: 'ns_common:actions.connect' })).toBeInTheDocument())
		expect(mocks.fetchEventSource).toHaveBeenCalledTimes(1)
	})

	it('aborts on disconnect and opens a new connection when reconnecting', async () => {
		renderPage()

		fireEvent.click(screen.getByRole('button', { name: 'Select reader' }))
		fireEvent.click(screen.getByRole('button', { name: 'ns_common:actions.connect' }))
		await waitFor(() => expect(mocks.fetchEventSource).toHaveBeenCalledTimes(1))

		const options = mocks.fetchEventSource.mock.calls[0][1]
		await act(async () => {
			await options.onopen(new Response(null, { headers: { 'content-type': 'text/event-stream' } }))
		})
		fireEvent.click(screen.getByRole('button', { name: 'ns_common:actions.disconnect' }))
		expect(options.signal.aborted).toBe(true)

		fireEvent.click(screen.getByRole('button', { name: 'ns_common:actions.connect' }))
		await waitFor(() => expect(mocks.fetchEventSource).toHaveBeenCalledTimes(2))
		expect(mocks.fetchEventSource.mock.calls[1][1].signal.aborted).toBe(false)
	})
})
