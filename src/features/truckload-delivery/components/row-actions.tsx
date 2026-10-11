import { CommonActions, UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import type { ColumnDefBase } from '@tanstack/react-table'
import { format } from 'date-fns'
import { isEmpty, isNil, omitBy, pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { GhostButton } from '../../../components/shared/ghost-button'
import { usePageContext } from '../contexts/page-context'
import type { ITruckloadDelivery } from '../types'

const RowActions: ColumnDefBase<ITruckloadDelivery, any>['cell'] = ({ row }) => {
	const data = pick(row.original, [
		'factory_entrance_time',
		'factory_departure_time',
		'dispatch_order',
		'license_plate',
		'seal_number',
		'container_number',
		'approval_status',
		'punctured_container',
		'smelling_container',
		'moist_container'
	])
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<RoleBaseAccessControl
			authorizedRoles={[UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF, UserRole.SECURITY_GUARD]}>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild={true} className='disabled:cursor-not-allowed'>
					<GhostButton>
						<Icon className='inline-block!' name='Ellipsis' />
					</GhostButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40'>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								event$.emit({
									action: CommonActions.UPDATE_MANY,
									payload: omitBy(
										{
											...data,
											factory_entrance_time: data.factory_entrance_time
												? {
														date: new Date(data.factory_entrance_time),
														time: format(data.factory_entrance_time, 'HH:mm')
													}
												: null,
											factory_departure_time: data.factory_departure_time
												? {
														date: new Date(data.factory_departure_time),
														time: format(data.factory_departure_time, 'HH:mm')
													}
												: null
										},
										(value) => isNil(value) || isEmpty(value)
									)
								})
							}}>
							<Icon className='hidden lg:inline-block xl:inline-block' name='PencilLine' />
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive hover:text-destructive!'
							onClick={() =>
								event$.emit({
									action: CommonActions.DELETE_MANY,
									payload: { dispatch_order: data.dispatch_order! }
								})
							}>
							<Icon className='hidden lg:inline-block xl:inline-block' name='Trash2' />
							{t('ns_common:actions.delete')}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</RoleBaseAccessControl>
	)
}

export default RowActions
