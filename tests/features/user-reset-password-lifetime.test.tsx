import { fuzzyFilter } from '@components/addons/tanstack-table/utils/fuzzy-filter.util'
import { dateRangeFilter } from '@components/addons/tanstack-table/utils/in-date-range-filter.util'
import axiosInstance from '@configs/axios.config'
import type { IUser } from '@features/auth/types'
import UserActionDropdown from '@features/user/components/user-action-dropdown'
import { PageContextProvider } from '@features/user/contexts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import copy from 'copy-to-clipboard'
import React from 'react'
import { expect, it, vi } from 'vitest'

vi.mock('@configs/axios.config', () => ({ default: { patch: vi.fn() } }))
vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key })
}))

const account: IUser = {
	_id: 'operator-7',
	username: 'operator-7',
	display_name: 'Operator',
	password: '',
	avatar: '',
	roles: [],
	is_system_user: false,
	deleted: false
}

function Row() {
	const table = useReactTable({
		data: [account],
		columns: [{ id: 'actions', cell: UserActionDropdown }],
		filterFns: { fuzzy: fuzzyFilter, inDateRange: dateRangeFilter },
		getCoreRowModel: getCoreRowModel()
	})
	const cell = table.getRowModel().rows[0].getAllCells()[0]
	return flexRender(cell.column.columnDef.cell, cell.getContext())
}

it('preserves the pending reset and one-time password when its virtualized row unmounts', async () => {
	let resolve!: (value: ResponseBody<{ password: string }>) => void
	vi.mocked(axiosInstance.patch).mockReturnValueOnce(new Promise((done) => (resolve = done)))
	const client = new QueryClient()
	const user = userEvent.setup()
	const page = (showRow: boolean) => (
		<QueryClientProvider client={client}>
			<PageContextProvider>{showRow && <Row />}</PageContextProvider>
		</QueryClientProvider>
	)
	const view = render(page(true))
	fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
	fireEvent.click(await screen.findByRole('menuitem', { name: 'ns_auth:actions.reset_password' }))
	const confirmation = await screen.findByRole('alertdialog')
	await user.click(within(confirmation).getByRole('button', { name: 'ns_common:actions.confirm' }))

	view.rerender(page(false))
	expect(screen.getByRole('alertdialog')).toBeInTheDocument()

	await act(async () => {
		resolve({
			message: 'Success',
			statusCode: 200,
			metadata: { password: 'one-time-password' },
			path: '/user/reset-password/operator-7',
			timestamp: new Date()
		})
	})
	const result = await screen.findByRole('dialog')
	expect(result).toHaveTextContent('one-time-password')
	await user.click(within(result).getByRole('button', { name: 'ns_common:editor.copy' }))
	expect(copy).toHaveBeenCalledWith('one-time-password', undefined)
	await user.click(within(result).getByRole('button', { name: 'ns_common:actions.close' }))
	expect(screen.queryByText('one-time-password')).not.toBeInTheDocument()
})
