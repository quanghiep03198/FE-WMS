'use no memo'

import { UserRole } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import { Button, Icon } from '@/components/ui'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { DataTableFacetedFilter, DataTableFacetedFilterProps } from './user-facted-filter'
import UserGlobalFilter from './user-global-filter'
import UserStatusFilter from './user-status-filter'
import { UserTableViewOptions } from './user-table-view-options'

const UserTableToolbar: React.FC<{
	table: Table<IUser>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table }) => {
	const { t, i18n } = useTranslation()
	const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter

	const roles: DataTableFacetedFilterProps['options'] = useMemo(
		() => [
			{
				label: t('ns_auth:roles.ADMIN'),
				value: UserRole.ADMIN,
				icon: 'UserCog'
			},
			{
				label: t('ns_auth:roles.MANAGER'),
				value: UserRole.MANAGER,
				icon: 'UserStar'
			},
			{
				label: t('ns_auth:roles.FG_WAREHOUSE_STAFF'),
				value: UserRole.FG_WAREHOUSE_STAFF,
				icon: 'User'
			},
			{
				label: String(t('ns_auth:roles.DG_WAREHOUSE_STAFF')),
				value: UserRole.DG_WAREHOUSE_STAFF,
				icon: 'User'
			},
			{
				label: t('ns_auth:roles.IE_STAFF'),
				value: UserRole.IE_STAFF,
				icon: 'User'
			},
			{
				label: t('ns_auth:roles.SECURITY_GUARD'),
				value: UserRole.SECURITY_GUARD,
				icon: 'User'
			}
		],
		[i18n.language]
	)

	return (
		<Toolbar>
			<ToolbarGroup>
				<UserGlobalFilter table={table} />
				<UserStatusFilter table={table} />
				{table.getColumn('roles') && (
					<DataTableFacetedFilter
						column={table.getColumn('roles')}
						title={t('ns_auth:fields.role')}
						options={roles}
					/>
				)}
				{isFiltered && (
					<Button
						variant='destructive'
						size='sm'
						onClick={() => {
							table.resetGlobalFilter()
							table.resetColumnFilters()
						}}>
						{t('ns_common:actions.clear_filter')}
						<Icon name='X' />
					</Button>
				)}
			</ToolbarGroup>
			<ToolbarGroup>
				<UserTableViewOptions table={table} />
			</ToolbarGroup>
		</Toolbar>
	)
}

const Toolbar: React.FC<React.ComponentProps<'div'>> = tw.div`flex items-stretch justify-between`
const ToolbarGroup: React.FC<React.ComponentProps<'div'>> = tw.div`flex items-center gap-x-1`

export default UserTableToolbar
