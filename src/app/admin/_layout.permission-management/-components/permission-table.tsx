import RoleFilter from '@/app/admin/_layout.permission-management/-components/role-filter'
import StatusFilter from '@/app/admin/_layout.permission-management/-components/status-filter'
import {
	useGetPermissionManagement,
	useSoftDeletePermission
} from '@/app/admin/_layout.permission-management/-hooks/use-permission-management'
import { IPermission } from '@/common/types/entities'
import {
	Badge,
	Button,
	DataTable,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PermissionTable = () => {
	const { t, i18n } = useTranslation()
	const [selectedRow, setSelectedRow] = useState<IPermission | null>(null)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const columnHelper = createColumnHelper<IPermission>()
	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: '#',
				cell: ({ row }) => <span>{row.index + 1}</span>,
				size: 60,
				maxSize: 60
			}),
			columnHelper.accessor('permission_name', {
				header: 'Permission name',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 100
			}),
			columnHelper.accessor('role', {
				header: 'Role',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: (row, id, filterValues) => {
					if (!filterValues?.length) return true
					return filterValues.includes(row.getValue(id))
				},
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 100
			}),
			columnHelper.accessor('parent_id', {
				header: 'Parent ID',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 80
			}),
			columnHelper.accessor('is_active', {
				header: 'Active',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: (row, id, filterValues) => {
					console.log('Filtering isactive with values:', filterValues)
					if (!filterValues?.length) return true
					return filterValues.includes(row.getValue(id))
				},
				cell: ({ getValue }) => {
					console.log('Rendering isactive cell with value:', getValue())
					switch (getValue()) {
						case 'Y':
							return <Badge variant='default'>Active</Badge>
						case 'N':
							return <Badge variant='destructive'>Inactive</Badge>
						default:
							return <Badge variant='secondary'>Unknown</Badge>
					}
				},
				size: 100,
				maxSize: 100
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: 'Actions',
				cell: ({ row }) => (
					<div className='text-center'>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<span className='text-lg'>...</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>
									<button
										onClick={() => {
											setSelectedRow(row.original)
										}}
										className='p-1'>
										<div className='flex items-center gap-2'>
											<Pencil size={16} />
											<span className='mx-1'>Update</span>
										</div>
									</button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button
										onClick={() => {
											setConfirmDialogOpen(true)
											setSelectedRow(row.original)
										}}
										className='p-1'>
										<div className='flex items-center gap-2'>
											<Trash size={16} />
											<span>Delete</span>
										</div>
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
				enableHiding: false,
				enableResizing: true,
				size: 70,
				maxSize: 70
			})
		],
		[]
	)
	const { data: permissions = [], isLoading, refetch } = useGetPermissionManagement()
	const { mutateAsync: mutateAsyncDelete } = useSoftDeletePermission()

	const handleDelete = useCallback(
		async (row: IPermission) => {
			try {
				await mutateAsyncDelete(row.id)
				await refetch()
			} catch (error) {
				console.error('Delete user failed:', error)
			}
		},
		[mutateAsyncDelete, refetch]
	)

	return (
		<Fragment>
			<DataTable
				border='all'
				columns={columns}
				data={permissions ?? []}
				loading={isLoading}
				enableExpanding={true}
				enableColumnResizing={true}
				containerProps={{ className: 'h-[50vh] w-full' }}
				toolbarProps={{
					override: true,
					render({ table, event$ }) {
						return (
							<div className='flex items-center justify-between'>
								{/* Left slot */}
								<div className='flex items-center gap-x-1'>
									<div className='flex w-48 min-w-[150px] items-center rounded-md border border-gray-500/40 bg-transparent px-2'>
										<DebouncedInput
											type='search'
											value={table.getState().globalFilter}
											onChange={(value) => table.setGlobalFilter(value)}
											className='w-full border-none bg-transparent text-sm text-white shadow-none outline-none placeholder:text-sm placeholder:text-gray-400'
											placeholder='Filter users...'
										/>
									</div>
									<StatusFilter
										onChange={(selectedStatuses) => {
											table.getColumn('is_active')?.setFilterValue(selectedStatuses)
										}}
									/>

									<RoleFilter
										onChange={(selectedRoles) => {
											table.getColumn('role')?.setFilterValue(selectedRoles)
										}}
									/>
								</div>

								{/* Right slot */}
								<div>
									<Button>Add</Button>
								</div>
							</div>
						)
					}
				}}
			/>
			<ConfirmDialog
				open={confirmDialogOpen}
				title='Xoá'
				description='Xác nhận vô hiệu hoá permission?'
				onConfirm={() => handleDelete(selectedRow)}
				onOpenChange={setConfirmDialogOpen}
				onCancel={() => {
					console.log('Cancelled')
					setConfirmDialogOpen(false)
					setSelectedRow(null)
				}}
			/>

			{selectedRow ? (
				<span>update</span>
			) : (
				// <UserManagementModal row={selectedRow} isOpen={isOpenModal} onOpenChange={setIsOpenModal} />
				// <UserManagementModal isOpen={isOpenModal} onOpenChange={setIsOpenModal} />
				<span>add</span>
			)}
		</Fragment>
	)
}

export default PermissionTable
