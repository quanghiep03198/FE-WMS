import { CommonActions } from '@/common/constants/enums'
import {
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
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import StatusChangeButtonsGroup from './status-buttons-group'

type RowActionsDropdownProps = Record<
	'data',
	Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'container_number' | 'approval_status'>
>

const RowActions: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<Div className='flex w-full items-center justify-end [&_svg]:hidden lg:[&_svg]:inline-block xl:[&_svg]:inline-block'>
			<StatusChangeButtonsGroup data={data} />
			{data.approval_status !== TruckloadDeliveryStatus.CONFIRMED && (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger
						className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'aspect-square' })}>
						<Icon name='Ellipsis' className='!inline-block' />
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
								<Icon name='PencilLine' className='hidden lg:inline-block xl:inline-block' />
								{t('ns_common:actions.update')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='text-destructive hover:!text-destructive'
								onClick={() =>
									event$.emit({ action: CommonActions.DELETE_MANY, payload: data.dispatch_order })
								}>
								<Icon name='Trash2' className='hidden lg:inline-block xl:inline-block' />
								{t('ns_common:actions.delete')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</Div>
	)
}

export default RowActions
