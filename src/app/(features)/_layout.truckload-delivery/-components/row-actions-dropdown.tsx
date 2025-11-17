import { CommonActions } from '@/common/constants/enums'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useSetTruckloadDeliveryStatusMutation } from '../-hooks/use-truckload-delivery-asm'

type RowActionsDropdownProps = Record<'data', ITruckloadDelivery>

const RowActionsDropdown: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: setStatusAsync } = useSetTruckloadDeliveryStatusMutation()

	const handleSetStatus = (status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE) => {
		return toast.promise(setStatusAsync({ id: data.id, status }), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<Icon name='EllipsisVertical' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							event$.emit({ action: CommonActions.UPDATE, payload: data })
						}}>
						<Icon name='PencilLine' /> {t('ns_common:actions.update')}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={!data.license_plate || !data.container_number}
						onClick={() => handleSetStatus(TruckloadDeliveryStatus.CONFIRMED)}>
						<Icon name='BookmarkCheck' />
						{t('ns_common:actions.approve')}
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={!data.license_plate || !data.container_number}
						onClick={() => handleSetStatus(TruckloadDeliveryStatus.REQUEST_CHANGE)}>
						<Icon name='BookmarkX' />
						{t('ns_common:actions.request_change')}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={data.status !== TruckloadDeliveryStatus.PENDING}
						className='text-destructive hover:!text-destructive'
						onClick={() => event$.emit({ action: CommonActions.DELETE, payload: data.id })}>
						<Icon name='Trash2' />
						{t('ns_common:actions.delete')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default RowActionsDropdown
