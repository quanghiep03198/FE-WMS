'use no memo'

import { UserRole } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import type { IUser } from '@/common/types/entities'
import { Button, Icon, Tooltip } from '@/components/ui'
import type { Table } from '@tanstack/react-table'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import type { DataTableFacetedFilterProps } from './user-facted-filter'
import { DataTableFacetedFilter } from './user-facted-filter'
import UserGlobalFilter from './user-global-filter'
import UserStatusFilter from './user-status-filter'
import UserTableRefreshButton from './user-table-refetch-button'
import { UserTableViewOptions } from './user-table-view-options'

const UserTableToolbar: React.FC<{
	table: Table<IUser>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table }) => {
	const { t, i18n } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 767px)')
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
				icon: 'ShieldUser'
			}
		],
		[i18n.language]
	)

	return (
		<Toolbar>
			<ToolbarGroup className='md:flex-1 md:basis-full'>
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
					<Tooltip message={t('ns_common:actions.clear_filter')} contentProps={{ hidden: !isMobile }}>
						<Button
							variant='secondary'
							size={isMobile ? 'icon' : 'default'}
							onClick={() => {
								table.resetGlobalFilter()
								table.resetColumnFilters()
							}}>
							{!isMobile && t('ns_common:actions.clear_filter')}
							<Icon name='FunnelX' />
						</Button>
					</Tooltip>
				)}
			</ToolbarGroup>
			<ToolbarGroup>
				<UserTableRefreshButton />
				<UserTableViewOptions table={table} />
			</ToolbarGroup>
		</Toolbar>
	)
}

const Toolbar: React.FC<React.ComponentProps<'div'>> = tw.div`flex items-stretch justify-between`
const ToolbarGroup: React.FC<React.ComponentProps<'div'>> = tw.div`flex items-center gap-x-1.5`

export default UserTableToolbar
