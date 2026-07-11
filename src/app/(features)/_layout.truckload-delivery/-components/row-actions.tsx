import { CommonActions, UserRole } from '@/common/constants/enums'
import RoleBaseAccessControl from '@/components/guards/role-base-access-control'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import type { ColumnDefBase } from '@tanstack/react-table'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { type ITruckloadDelivery } from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'

const RowActions: ColumnDefBase<ITruckloadDelivery, any>['cell'] = ({ row }) => {
	const data = pick(row.original, [
		'dispatch_order',
		'license_plate',
		'container_number',
		'approval_status',
		'punctured_container',
		'smelling_container',
		'moist_container'
	])
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<RoleBaseAccessControl authorizedRoles={[UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger
					asChild={true}
					disabled={data.approval_status === TruckloadDeliveryStatus.CONFIRMED}
					className='disabled:cursor-not-allowed'>
					<GhostButton>
						<Icon name='Ellipsis' className='!inline-block' />
					</GhostButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40'>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								event$.emit({
									action: CommonActions.UPDATE_MANY,
									payload: pick(data, [
										'dispatch_order',
										'license_plate',
										'container_number',
										'punctured_container',
										'smelling_container',
										'moist_container'
									])
								})
							}}>
							<Icon name='PencilLine' className='hidden lg:inline-block xl:inline-block' />
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive hover:!text-destructive'
							onClick={() => event$.emit({ action: CommonActions.DELETE_MANY, payload: data.dispatch_order })}>
							<Icon name='Trash2' className='hidden lg:inline-block xl:inline-block' />
							{t('ns_common:actions.delete')}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</RoleBaseAccessControl>
	)
}

export default RowActions
