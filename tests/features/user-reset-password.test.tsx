import axiosInstance from '@configs/axios.config'
import { fuzzyFilter } from '@components/addons/tanstack-table/utils/fuzzy-filter.util'
import { dateRangeFilter } from '@components/addons/tanstack-table/utils/in-date-range-filter.util'
import type { IUser } from '@features/auth/types'
import UserActionDropdown from '@features/user/components/user-action-dropdown'
import { PageContextProvider } from '@features/user/contexts'
import authTranslations from '@i18n/en/ns_auth.i18n'
import commonTranslations from '@i18n/en/ns_common.i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import copy from 'copy-to-clipboard'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { toast } from 'sonner'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@configs/axios.config', () => ({ default: { patch: vi.fn() } }))
vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const account: IUser = {
	_id: 'user-42',
	username: '<operator>',
	display_name: 'Warehouse operator',
	password: 'never-display-existing-password',
	avatar: '',
	roles: [],
	is_system_user: false,
	deleted: false
}
const i18n = createInstance()
const response = (password = 'new-password-42'): ResponseBody<{ password: string }> => ({
	message: 'Success',
	statusCode: 200,
	metadata: { password },
	path: '/user/reset-password/user-42',
	timestamp: new Date()
})

function Actions() {
	const table = useReactTable({
		data: [account],
		columns: [{ id: 'actions', cell: UserActionDropdown }],
		filterFns: { fuzzy: fuzzyFilter, inDateRange: dateRangeFilter },
		getCoreRowModel: getCoreRowModel()
	})
	const cell = table.getRowModel().rows[0].getAllCells()[0]
	return flexRender(cell.column.columnDef.cell, cell.getContext())
}

function setup() {
	const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
	const user = userEvent.setup()
	render(
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={client}>
				<PageContextProvider>
					<Actions />
				</PageContextProvider>
			</QueryClientProvider>
		</I18nextProvider>
	)
	return { user, client }
}

async function openConfirmation() {
	const trigger = screen.getByRole('button')
	fireEvent.keyDown(trigger, { key: 'Enter' })
	const reset = await screen.findByRole('menuitem', { name: 'Reset password' })
	fireEvent.click(reset)
	return screen.findByRole('alertdialog')
}

beforeAll(async () => {
	await i18n.init({
		lng: 'en',
		resources: { en: { ns_auth: authTranslations, ns_common: commonTranslations } },
		interpolation: { escapeValue: false }
	})
})

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(copy).mockReturnValue(true)
	vi.mocked(axiosInstance.patch).mockResolvedValue(response())
})

describe('user password reset', () => {
	it('requires confirmation naming the account and cancels without sending a request', async () => {
		const { user } = setup()
		const dialog = await openConfirmation()
		expect(dialog).toHaveTextContent('<operator>')
		expect(dialog.querySelector('operator')).toBeNull()
		expect(axiosInstance.patch).not.toHaveBeenCalled()
		await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
		await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
		expect(axiosInstance.patch).not.toHaveBeenCalled()
	})

	it('resets the selected account, copies the new password and clears it on close', async () => {
		const { user, client } = setup()
		const confirmation = await openConfirmation()
		await user.click(within(confirmation).getByRole('button', { name: 'Confirm' }))
		const result = await screen.findByRole('dialog', { name: 'Password reset' })
		expect(axiosInstance.patch).toHaveBeenCalledExactlyOnceWith('/user/reset-password/user-42')
		expect(result).toHaveTextContent('new-password-42')
		expect(screen.queryByText(account.password)).not.toBeInTheDocument()
		await user.click(within(result).getByRole('button', { name: 'Copy' }))
		expect(copy).toHaveBeenCalledWith('new-password-42', undefined)
		expect(result).toHaveTextContent('Password copied')
		expect(
			JSON.stringify(
				client
					.getMutationCache()
					.getAll()
					.map((entry) => entry.state.data)
			)
		).not.toContain('new-password-42')
		await user.click(within(result).getByRole('button', { name: 'Close' }))
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
		expect(screen.queryByText('new-password-42')).not.toBeInTheDocument()
		await openConfirmation()
		expect(screen.queryByText('new-password-42')).not.toBeInTheDocument()
	})

	it('keeps confirmation open and prevents duplicate submission while the request is pending', async () => {
		let resolve!: (value: ResponseBody<{ password: string }>) => void
		vi.mocked(axiosInstance.patch).mockReturnValueOnce(new Promise((done) => (resolve = done)))
		const { user } = setup()
		const dialog = await openConfirmation()
		const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
		await user.click(confirm)
		expect(confirm).toBeDisabled()
		await user.click(confirm)
		await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
		expect(screen.getByRole('alertdialog')).toBeInTheDocument()
		expect(axiosInstance.patch).toHaveBeenCalledTimes(1)
		resolve(response())
		await screen.findByRole('dialog', { name: 'Password reset' })
	})

	it('reports failure and allows retry without showing a stale password', async () => {
		vi.mocked(axiosInstance.patch).mockRejectedValueOnce(new Error('Request failed'))
		const { user } = setup()
		const dialog = await openConfirmation()
		await user.click(within(dialog).getByRole('button', { name: 'Confirm' }))
		const retry = await within(dialog).findByRole('button', { name: 'Retry' })
		expect(toast.error).toHaveBeenCalled()
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		await user.click(retry)
		expect(await screen.findByRole('dialog', { name: 'Password reset' })).toHaveTextContent('new-password-42')
	})

	it('reports a malformed successful response instead of showing an empty password', async () => {
		vi.mocked(axiosInstance.patch).mockResolvedValueOnce(response(''))
		const { user } = setup()
		const dialog = await openConfirmation()
		await user.click(within(dialog).getByRole('button', { name: 'Confirm' }))
		await within(dialog).findByRole('button', { name: 'Retry' })
		expect(toast.error).toHaveBeenCalled()
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	it('reports clipboard failure without claiming the password was copied', async () => {
		vi.mocked(copy).mockReturnValue(false)
		const { user } = setup()
		const dialog = await openConfirmation()
		await user.click(within(dialog).getByRole('button', { name: 'Confirm' }))
		const result = await screen.findByRole('dialog', { name: 'Password reset' })
		await user.click(within(result).getByRole('button', { name: 'Copy' }))
		expect(result).toHaveTextContent('Could not copy password')
		expect(result).not.toHaveTextContent('Password copied')
	})
})
