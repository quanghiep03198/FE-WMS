import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IUser } from '@/common/types/entities'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	DataTable,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	Typography
} from '@/components/ui'
import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { formatRelative } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../-hooks/use-user-asm'
import RoleBadge from './role-badge'

const UserTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IUser>()
	const { data, isLoading } = useGetUsersQuery()
	const dateLocale = useDateLocale()

	const columns = useMemo(() => {
		return [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => <IndeterminateCheckbox {...props} />,
				cell: (props) => <RowSelectionCheckbox {...props} />,
				size: 60,
				maxSize: 60,
				enableResizing: false
			}),
			columnHelper.accessor('display_name', {
				header: t('ns_auth:fields.display_name'),
				cell: ({ row, getValue }) => (
					<Div className='inline-flex items-center gap-x-2'>
						<Avatar className='size-8'>
							<AvatarImage src={row.original?.picture} alt={getValue()} />
							<AvatarFallback>G</AvatarFallback>
						</Avatar>
						<Typography variant='small' className='capitalize'>
							{getValue()}
						</Typography>
					</Div>
				),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('username', {
				header: t('ns_auth:fields.username'),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				cell: TableCellText
			}),
			columnHelper.accessor('email', {
				header: t('ns_auth:fields.email'),
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
					return roles.map((role) => <RoleBadge key={role} value={role} />)
				},
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('last_login_at', {
				header: t('ns_auth:fields.last_login_at'),
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted'>
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					return capitalize(formatRelative(new Date(value), new Date(), { locale: dateLocale }))
				},
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('is_active', {
				header: t('ns_common:common_fields.status'),
				cell: ({ getValue }) => {
					const isActive = getValue()
					return (
						<Badge variant='outline' className='justify-center gap-x-2 whitespace-nowrap rounded'>
							{isActive ? (
								<StatusIndicator
									state='active'
									size='sm'
									label={t('ns_common:status.active')}
									labelClassName='text-xs'
								/>
							) : (
								<StatusIndicator
									state='idle'
									size='sm'
									label={t('ns_common:status.deactivated')}
									labelClassName='text-xs'
								/>
							)}
						</Badge>
					)
				},
				// cell: (info) => info.getValue().join(', '),
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
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger className='text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'>
							<Icon name='Ellipsis' />
						</DropdownMenuTrigger>
						<DropdownMenuContent side='left' align='start'>
							<DropdownMenuItem>{t('ns_common:actions.update')}</DropdownMenuItem>

							{!row.original.is_active ? (
								<DropdownMenuItem>{t('ns_common:actions.activate')}</DropdownMenuItem>
							) : (
								<DropdownMenuItem>{t('ns_common:actions.deactivate')}</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)
			})
		]
	}, [i18n.language])

	return <DataTable columns={columns} data={data} loading={isLoading} border='bottom-only' />
}

export default UserTable
