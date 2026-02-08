import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IUser } from '@/common/types/entities'
import { Avatar, AvatarFallback, AvatarImage, Badge, DataTable, Div, Icon, Typography } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../-hooks/use-user-asm'
import RoleBadge from './role-badge'
import UserActionDropdown from './user-action-dropdown'
import UserTableToolbar from './user-table-toolbar'

const UserTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IUser>()
	const { data, isLoading } = useGetUsersQuery()
	const dateLocale = useDateLocale()

	const columns = useMemo(() => {
		return [
			columnHelper.accessor('username', {
				header: t('ns_auth:fields.username'),
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enableHiding: false,
				enableSorting: true,
				enableResizing: true,
				cell: ({ row, getValue }) => (
					<Div className='inline-flex items-center gap-x-2'>
						<Avatar className='size-7'>
							<AvatarImage src={row.original?.picture} alt={getValue()} />
							<AvatarFallback>G</AvatarFallback>
						</Avatar>
						<Typography variant='small' className='line-clamp-1 font-medium'>
							{getValue()}
						</Typography>
					</Div>
				)
			}),
			columnHelper.accessor('display_name', {
				header: t('ns_auth:fields.display_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableHiding: true,
				cell: TableCellText
			}),
			columnHelper.accessor('email', {
				header: t('ns_auth:fields.email'),
				cell: TableCellText,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableHiding: false
			}),
			columnHelper.accessor('employee_code', {
				header: t('ns_auth:fields.employee_code'),
				cell: TableCellText,
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('roles', {
				header: t('ns_auth:fields.role'),
				cell: ({ getValue }) => {
					const roles = getValue()
					return <EllipsisList data={roles} template={RoleBadge} threshhold={1} />
				},
				filterFn: 'arrIncludesSome',
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableHiding: true
			}),
			columnHelper.accessor('created', {
				header: t('ns_auth:fields.joined_system_date'),
				enableSorting: true,
				enableResizing: true,
				enableHiding: true,
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted'>
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					return capitalize(format(new Date(value), 'PPP', { locale: dateLocale }))
				}
			}),
			columnHelper.accessor('is_active', {
				id: 'is_active',
				header: t('ns_common:common_fields.status'),
				enableHiding: true,
				cell: ({ getValue }) => {
					const isActive = getValue()
					return (
						<Badge
							variant='outline'
							className='justify-center gap-x-2 whitespace-nowrap rounded-l-full rounded-r-full'>
							<Icon
								name={isActive ? 'CircleCheck' : 'CircleMinus'}
								aria-current={isActive}
								className='stroke-muted-foreground aria-[current=true]:stroke-success'
							/>
							{t(isActive ? 'ns_common:status.active' : 'ns_common:status.deactivated')}
						</Badge>
					)
				},
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				meta: { align: 'center' },
				size: 60,
				maxSize: 60,
				enableHiding: false,
				cell: UserActionDropdown
			})
		]
	}, [i18n.language])

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			border='bottom-only'
			containerProps={{
				style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
			}}
			virtualizerOptions={{ estimateSize: 50 }}
			toolbarProps={{
				override: true,
				render: UserTableToolbar
			}}
		/>
	)
}

export default UserTable
