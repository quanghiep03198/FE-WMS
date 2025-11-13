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
import { usePageContext } from '../-contexts/page-context'

type RowActionsDropdownProps = Record<'data', ITruckloadDelivery>

const RowActionsDropdown: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<Icon name='EllipsisVertical' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-40'>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							event$.emit({ action: CommonActions.UPDATE, payload: data })
						}}>
						<Icon name='PencilLine' /> {t('ns_common:actions.update')}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => event$.emit({ action: CommonActions.CONFIRM, payload: data })}>
						<Icon name='BookmarkCheck' />
						{data.status === 'confirmed' ? t('ns_common:actions.reapprove') : t('ns_common:actions.approve')}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
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
