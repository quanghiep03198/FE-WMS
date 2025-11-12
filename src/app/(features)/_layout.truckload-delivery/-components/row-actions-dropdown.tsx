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

type RowActionsDropdownProps = Record<'data', ITruckloadDelivery>

const RowActionsDropdown: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Icon name='Ellipsis' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='max-w-36'>
				<DropdownMenuGroup>
					<DropdownMenuItem>{t('ns_common:actions.update')}</DropdownMenuItem>
					<DropdownMenuItem>{t('ns_common:actions.approve')}</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>{t('ns_common:actions.delete')}</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default RowActionsDropdown
