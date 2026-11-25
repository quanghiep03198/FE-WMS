import type { IUser } from '@features/auth/types'
import { fuzzyFilter } from '@components/addons/tanstack-table/utils/fuzzy-filter.util'
import { dateRangeFilter } from '@components/addons/tanstack-table/utils/in-date-range-filter.util'
import UserTable from '@features/user/components/user-table'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
vi.mock('@hooks/use-date-locale', () => ({ useDateLocale: () => undefined }))
vi.mock('@features/user/components/user-action-dropdown', () => ({ default: () => null }))
vi.mock('@features/user/components/user-table-toolbar', () => ({ default: () => null }))
vi.mock('@features/user/hooks/use-user-request', () => ({
	useGetUsersQuery: () => ({
		isLoading: false,
		data: [
			{
				_id: 'operator-1',
				username: 'operator-1',
				display_name: 'Operator',
				password: 'existing-password-must-not-leak',
				roles: [],
				deleted: false
			},
			{ _id: 'operator-2', username: 'operator-2', display_name: 'Supervisor', roles: [], deleted: false }
		]
	})
}))
vi.mock('@components/addons/tanstack-table', () => ({
	default: function Table({ data, columns }: { data: IUser[]; columns: ColumnDef<IUser>[] }) {
		const table = useReactTable({
			data,
			columns,
			filterFns: { fuzzy: fuzzyFilter, inDateRange: dateRangeFilter },
			getCoreRowModel: getCoreRowModel()
		})
		return (
			<table>
				<thead>
					{table.getHeaderGroups().map((group) => (
						<tr key={group.id}>
							{group.headers.map((header) => (
								<th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		)
	}
}))

describe('user table password column', () => {
	it('places a six-star display column after username without reading actual passwords', () => {
		render(<UserTable />)
		const headers = screen.getAllByRole('columnheader')
		expect(headers[0]).toHaveTextContent('ns_auth:fields.username')
		expect(headers[1]).toHaveTextContent('ns_auth:fields.password')
		const rows = screen.getAllByRole('row').slice(1)
		for (const row of rows) {
			expect(within(row).getAllByRole('cell')[1]).toHaveTextContent(/^\*{6}$/)
		}
		expect(screen.queryByText('existing-password-must-not-leak')).not.toBeInTheDocument()
	})
})
