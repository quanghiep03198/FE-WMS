import { IUserManagement } from '@/common/types/entities'
import { DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const UserManagementTable: React.FC = () => {
	const { t } = useTranslation()
	const columnHelper = createColumnHelper<IUserManagement>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('user_code', {
				header: 'User Code',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('employee_code', {
				header: 'Employee Code',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('user_name', {
				header: 'User Name',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('role', {
				header: 'Role',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
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
									<button onClick={() => console.log('Edit:', row.original)} className='p-1'>
										<div className='flex items-center gap-2'>
											<Pencil size={16} />
											<span className='mx-1'>Update</span>
										</div>
									</button>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<button onClick={() => console.log('Delete:', row.original)} className='p-1'>
										<div className='flex items-center gap-2'>
											<Trash size={16} />
											<span className='mx-1'>Delete</span>
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

	const mockUsers: IUserManagement[] = [
		{
			keyid: 1,
			id: 1,
			user_code: 'U001',
			employee_code: 'E1001',
			user_password: '123456',
			role: 'Admin',
			created: '2025-10-27T09:00:00Z',
			updated: '2025-10-27T09:30:00Z',
			remark: 'System administrator',
			user_code_created: 'SYS',
			user_code_updated: 'SYS'
		},
		{
			keyid: 2,
			id: 2,
			user_code: 'U002',
			employee_code: 'E1002',
			user_password: 'abcdef',
			role: 'Manager',
			created: '2025-10-26T08:45:00Z',
			updated: '2025-10-27T09:10:00Z',
			remark: 'Department manager',
			user_code_created: 'U001',
			user_code_updated: 'U001'
		},
		{
			keyid: 3,
			id: 3,
			user_code: 'U003',
			employee_code: 'E1003',
			user_password: 'pass123',
			role: 'Employee',
			created: '2025-10-25T07:20:00Z',
			remark: 'Regular staff',
			user_code_created: 'U002'
		}
	]

	return (
		<Fragment>
			<DataTable
				border='all'
				columns={columns}
				data={mockUsers}
				loading={false}
				enableExpanding={true}
				enableColumnResizing={true}
				containerProps={{ className: 'h-[50vh] w-full' }}
				// toolbarProps={{
				// 	override: true,
				// 	render: ({table})=> <div>
				// 		{table.}
				// 	</div>
				// }}
			/>
		</Fragment>
	)
}

export default UserManagementTable
