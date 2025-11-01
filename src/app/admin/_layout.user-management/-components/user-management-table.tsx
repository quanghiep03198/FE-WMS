import UserManagementModal from '@/app/admin/_layout.user-management/-components/user-management-modal'
import {
	useDeleteUserManagement,
	useGetUserManagement
} from '@/app/admin/_layout.user-management/-hooks/use-user-management'
import { Role } from '@/common/constants/enums'
import { IUserManagement } from '@/common/types/entities'
import {
	Badge,
	DataTable,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { ClipboardList, Eye, EyeOff, Pencil, Trash, UserCheck, UserCog, UserPlus, Users } from 'lucide-react'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const UserManagementTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [selectedRow, setSelectedRow] = useState<IUserManagement | null>(null)
	const columnHelper = createColumnHelper<IUserManagement>()
	const { data: users = [], isLoading, refetch } = useGetUserManagement()
	const { mutateAsync } = useDeleteUserManagement()
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

	const handleDelete = useCallback(
		async (row: IUserManagement) => {
			try {
				await mutateAsync(row.keyid)
				await refetch()
			} catch (error) {
				console.error('Delete user failed:', error)
			}
		},
		[mutateAsync, refetch]
	)

	const handleUpdate = useCallback((row: IUserManagement) => {
		setSelectedRow(row)
		setIsOpenModal(true)
	}, [])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: '#',
				cell: ({ row }) => <span>{row.index + 1}</span>,
				size: 60,
				maxSize: 60
			}),
			columnHelper.accessor('user_code', {
				header: 'User Code',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 100
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
			columnHelper.accessor('employee_name', {
				header: 'Employee Name',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('user_password', {
				header: 'Password',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const password = getValue() as string | null
					const [show, setShow] = useState(false)

					if (!password) return 'Unknown'

					return (
						<div className='flex items-center gap-2'>
							<span className='font-mono'>{show ? password : '•'.repeat(password.length)}</span>
							<button
								type='button'
								onClick={() => setShow(!show)}
								className='text-muted-foreground transition hover:text-foreground'>
								{show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
							</button>
						</div>
					)
				},
				minSize: 100
			}),
			columnHelper.accessor('isactive', {
				header: 'Active',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
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
			columnHelper.accessor('role', {
				id: 'role_with_icon',
				header: 'Role',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const role = getValue() as IUserManagement['role']

					const getRoleIcon = (role: IUserManagement['role']) => {
						switch (role) {
							case Role.ADMIN:
								return <UserCog className='h-4 w-4 text-red-500' />
							case Role.MANAGER:
								return <UserCheck className='h-4 w-4 text-emerald-500' />
							case Role.ASSISTANT:
								return <UserPlus className='h-4 w-4 text-sky-500' />
							case Role.QC:
								return <ClipboardList className='h-4 w-4 text-yellow-500' />
							case Role.EMPLOYEE:
								return <Users className='h-4 w-4 text-purple-500' />
							default:
								return <Users className='h-4 w-4 text-muted-foreground' />
						}
					}

					return (
						<div className='flex items-center gap-2'>
							{getRoleIcon(role)}
							<span className='font-medium text-foreground'>{role ?? 'Unknown'}</span>
						</div>
					)
				},
				size: 150
			}),
			columnHelper.accessor('email', {
				header: 'Email',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('dept_code', {
				header: 'Department',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('sex', {
				header: 'Sex',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'equalsString',
				cell: ({ getValue }) => (getValue() === 'M' ? 'Male' : getValue() === 'F' ? 'Female' : 'Unknown')
			}),
			columnHelper.accessor('birthday', {
				header: 'Birthday',
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => (getValue() ? new Date(getValue()).toLocaleDateString() : 'Unknown')
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
									<button onClick={() => handleUpdate(row.original)} className='p-1'>
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

	return (
		<Fragment>
			<DataTable
				border='all'
				columns={columns}
				data={users ?? []}
				loading={isLoading}
				enableExpanding={true}
				enableColumnResizing={true}
				containerProps={{ className: 'h-[50vh] w-full' }}
			/>
			<ConfirmDialog
				open={confirmDialogOpen}
				title='Xoá'
				description='Xác nhận vô hiệu hoá người dùng?'
				onConfirm={() => handleDelete(selectedRow)}
				onOpenChange={setConfirmDialogOpen}
				onCancel={() => {
					console.log('Cancelled')
					setConfirmDialogOpen(false)
					setSelectedRow(null)
				}}
			/>

			{selectedRow ? (
				<UserManagementModal row={selectedRow} isOpen={isOpenModal} onOpenChange={setIsOpenModal} />
			) : (
				<UserManagementModal isOpen={isOpenModal} onOpenChange={setIsOpenModal} />
			)}
		</Fragment>
	)
}

export default UserManagementTable
