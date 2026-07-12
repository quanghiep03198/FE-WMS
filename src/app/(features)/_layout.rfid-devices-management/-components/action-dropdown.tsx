import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import type { IRFIDReaderDevice } from '@/features/rfid-device/types'
import { CommonActions, RecordStatus, UserRole } from '@common/constants/enums'
import type { CellContext } from '@tanstack/react-table'
import { isNil, pick } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import RoleBaseAccessControl from '@/components/guards/role-base-access-control'
import { usePageContext } from '../-contexts/page-context'

type UpdateStatusHandler = (payload: { device_sn: string; is_active: RecordStatus }) =>
	| (string & {
			unwrap: () => Promise<ResponseBody<unknown>>
	  })
	| (number & {
			unwrap: () => Promise<ResponseBody<unknown>>
	  })
	| {
			unwrap: () => Promise<ResponseBody<unknown>>
	  }

type DeleteHandler = () => void

const ActionDropdown: React.FC<
	CellContext<IRFIDReaderDevice, unknown> & { onUpdateStatus: UpdateStatusHandler; onDelete: DeleteHandler }
> = ({ row, onUpdateStatus, onDelete }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<RoleBaseAccessControl mode='mask' authorizedRoles={[UserRole.ADMIN]}>
			<DropdownMenu>
				<DropdownMenuTrigger className='text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'>
					<Icon name='Ellipsis' />
				</DropdownMenuTrigger>
				<DropdownMenuContent side='left' align='start'>
					<DropdownMenuItem
						onClick={() =>
							event$.emit({
								action: CommonActions.UPDATE,
								defaultValues: {
									...pick(row.original, [
										'station_no',
										'device_sn',
										'ip_address',
										'ip_port',
										'device_name_vi',
										'device_name_en',
										'device_name_cn'
									]),
									device_ant: row.original.device_ant === '0' || isNil(row.original.device_ant) ? '0' : '1'
								}
							})
						}>
						{t('ns_common:actions.update')}
					</DropdownMenuItem>
					{row.original.is_active === RecordStatus.INACTIVE ? (
						<DropdownMenuItem
							onClick={() =>
								onUpdateStatus({
									device_sn: row.original.device_sn,
									is_active: RecordStatus.ACTIVE
								})
							}>
							{t('ns_common:actions.activate')}
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem
							onClick={() =>
								onUpdateStatus({
									device_sn: row.original.device_sn,
									is_active: RecordStatus.INACTIVE
								})
							}>
							{t('ns_common:actions.deactivate')}
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onDelete}>{t('ns_common:actions.delete')}</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</RoleBaseAccessControl>
	)
}

export default ActionDropdown
