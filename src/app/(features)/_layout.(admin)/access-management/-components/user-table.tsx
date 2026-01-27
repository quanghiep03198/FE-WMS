import { IUser } from '@/common/types/entities'
import { Badge, DataTable, Icon } from '@/components/ui'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../-hooks/use-user-asm'

const UserTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IUser>()
	const { data, isLoading } = useGetUsersQuery()

	const columns = useMemo(() => {
		return [
			columnHelper.accessor('username', {
				header: t('ns_auth:fields.username'),
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('email', {
				header: t('ns_auth:fields.email'),
				cell: (info) => info.getValue(),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('roles', {
				header: t('ns_auth:fields.role'),
				cell: (info) => info.getValue().join(', '),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			}),
			columnHelper.accessor('last_login_at', {
				header: t('ns_auth:fields.last_login_at'),
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value) return t('ns_common:titles.unknown')
					return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
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
								<Fragment>
									<Icon name='CircleCheck' className='size-4 fill-success stroke-success-foreground' />
									{t('ns_common:status.active')}
								</Fragment>
							) : (
								<Fragment>
									<Icon name='CircleMinus' className='size-4 stroke-muted-foreground' />
									{t('ns_common:status.deactivated')}
								</Fragment>
							)}
						</Badge>
					)
				},
				// cell: (info) => info.getValue().join(', '),
				enableSorting: true,
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true
			})
		]
	}, [i18n.language])

	return <DataTable columns={columns} data={data} loading={isLoading} border='bottom-only' />
}

export default UserTable
