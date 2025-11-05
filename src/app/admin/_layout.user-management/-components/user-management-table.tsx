import { usePageProvider } from '@/app/admin/_layout.user-management/-contexts/page-content'
import {
	useDeleteUserManagement,
	useGetUserManagement
} from '@/app/admin/_layout.user-management/-hooks/use-user-management'
import { CommonActions, Role } from '@/common/constants/enums'
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
	const { t } = useTranslation()
	const { event$ } = usePageProvider()
	const columnHelper = createColumnHelper<IUserManagement>()

	//state management for row selection to delete confirmation
	const [selectedRow, setSelectedRow] = useState<IUserManagement | null>(null)

	//state mama
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { data: users = [], isLoading, refetch } = useGetUserManagement()
	const { mutateAsync } = useDeleteUserManagement()

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

	const handleUpdate = (row: IUserManagement) => {
		event$.emit({
			action: CommonActions.UPDATE,
			payload: row
		})
	}

	const columns = useMemo(
		() => [
			// # Column (row index)
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: '#',
				cell: ({ row }) => <span>{row.index + 1}</span>,
				size: 50,
				maxSize: 60
			}),

			// User Code
			columnHelper.accessor('user_code', {
				header: t('ns_admin:user_management.user_code'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 120,
				minSize: 100
			}),

			// Employee Code
			columnHelper.accessor('employee_code', {
				header: t('ns_admin:user_management.employee_code'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 120,
				minSize: 100
			}),

			// Employee Name
			columnHelper.accessor('employee_name', {
				header: t('ns_admin:user_management.employee_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 160,
				minSize: 140
			}),

			// Password (hidden text + toggle)
			columnHelper.accessor('user_password', {
				header: t('ns_admin:user_management.password'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const password = getValue() as string | null
					const [show, setShow] = useState(false)

					if (!password) return 'Unknown'

					const masked = '•'.repeat(Math.min(password.length, 8))

					return (
						<div className='flex items-center gap-2'>
							<span className='font-mono'>{show ? password : masked}</span>
							<button
								type='button'
								onClick={() => setShow(!show)}
								className='text-muted-foreground transition hover:text-foreground'
								title={show ? 'Hide password' : 'Show password'}>
								{show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
							</button>
						</div>
					)
				},
				size: 140,
				minSize: 120
			}),

			// Status
			columnHelper.accessor('isactive', {
				header: t('ns_common:common_fields.status'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					switch (getValue()) {
						case 'Y':
							return <Badge variant='default'>{t('ns_common:status.active')}</Badge>
						case 'N':
							return <Badge variant='destructive'>{t('ns_common:status.idle')}</Badge>
						default:
							return <Badge variant='secondary'>-</Badge>
					}
				},
				size: 100
			}),

			// Role
			columnHelper.accessor('role', {
				id: 'role_with_icon',
				header: t('ns_admin:user_management.role'),
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
							<span className='font-medium text-foreground'>
								{role ? t(`ns_common:role.${role}`) : 'Unknown'}
							</span>
						</div>
					)
				},
				size: 150,
				minSize: 130
			}),

			// Email
			columnHelper.accessor('email', {
				header: t('ns_admin:user_management.email'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 200,
				minSize: 160
			}),

			// Department
			columnHelper.accessor('dept_code', {
				header: t('ns_admin:user_management.department'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				size: 140,
				minSize: 120
			}),

			// Sex
			columnHelper.accessor('sex', {
				header: t('ns_admin:user_management.sex'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: true,
				filterFn: 'equalsString',
				cell: ({ getValue }) => (getValue() === 'M' ? 'Male' : getValue() === 'F' ? 'Female' : 'Unknown'),
				size: 100,
				maxSize: 150
			}),

			// Birthday
			columnHelper.accessor('birthday', {
				header: t('ns_admin:user_management.dob'),
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => (getValue() ? new Date(getValue()).toLocaleDateString() : 'Unknown'),
				size: 120,
				minSize: 100
			}),

			// Actions
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
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
											<span className='mx-1'>{t('ns_common:actions.update')}</span>
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
											<span>{t('ns_common:actions.delete')}</span>
										</div>
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
				enableHiding: false,
				enableResizing: true,
				size: 80,
				maxSize: 100
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
				title={t('ns_common:actions.delete')}
				description={t('ns_common:confirmation.delete_title')}
				onConfirm={() => handleDelete(selectedRow)}
				onOpenChange={setConfirmDialogOpen}
				onCancel={() => {
					setConfirmDialogOpen(false)
					setSelectedRow(null)
				}}
			/>
		</Fragment>
	)
}

export default UserManagementTable
