import { CommonActions } from '@/common/constants/enums'
import {
	Button,
	buttonVariants,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { pick } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useSetTruckloadDeliveryStatusMutation } from '../-hooks/use-truckload-delivery-asm'

type RowActionsDropdownProps = Record<
	'data',
	Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'container_number' | 'status'>
>

const RowActions: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: setStatusAsync } = useSetTruckloadDeliveryStatusMutation()

	const handleSetStatus = (status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE) => {
		return toast.promise(setStatusAsync({ dispatchOrder: data.dispatch_order, status }), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}

	return (
		<Div className='flex items-center justify-end'>
			{data.status !== TruckloadDeliveryStatus.CONFIRMED && (
				<Button variant='ghost' size='sm' onClick={() => handleSetStatus(TruckloadDeliveryStatus.CONFIRMED)}>
					<Icon name='CircleCheck' />
					{data.status === TruckloadDeliveryStatus.REQUEST_CHANGE
						? t('ns_common:actions.reconfirm')
						: t('ns_common:actions.confirm')}
				</Button>
			)}
			{data.status !== TruckloadDeliveryStatus.REQUEST_CHANGE && (
				<Button
					variant='ghost'
					className='text-destructive hover:text-destructive'
					size='sm'
					onClick={() => handleSetStatus(TruckloadDeliveryStatus.REQUEST_CHANGE)}>
					<Icon name='CircleAlert' />
					{t('ns_common:actions.report')}
				</Button>
			)}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Icon name='Ellipsis' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40'>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								event$.emit({
									action: CommonActions.UPDATE_MANY,
									payload: pick(data, ['dispatch_order', 'license_plate', 'container_number'])
								})
							}}>
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={data.status === TruckloadDeliveryStatus.CONFIRMED}
							className='text-destructive hover:!text-destructive'
							onClick={() => event$.emit({ action: CommonActions.DELETE_MANY, payload: data.dispatch_order })}>
							{t('ns_common:actions.delete')}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</Div>
	)
}

export default RowActions
