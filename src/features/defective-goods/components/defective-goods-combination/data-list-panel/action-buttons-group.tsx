import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Separator } from '@components/ui/separator'
import { Toggle } from '@components/ui/toggle'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useListPanelContext } from '../../../contexts/list-panel-context'
import { useGetDefectiveGoodsQuery } from '../../../hooks/use-defective-goods-request'
import DeleteButton from './delete-button'

const ActionButtonsGroup: React.FC = () => {
	const { t } = useTranslation()
	const { refetch } = useGetDefectiveGoodsQuery()
	const { isAllCardsExpanded, isTogglingExpand, toggleAllCardExpaned } = useListPanelContext()

	return (
		<Div className='ml-auto flex flex-1 items-center justify-end gap-x-1'>
			<Tooltip
				message={isAllCardsExpanded ? t('ns_common:actions.fold') : t('ns_common:actions.unfold')}
				triggerProps={{ asChild: true }}>
				<Toggle
					pressed={!isAllCardsExpanded}
					variant='default'
					className={cn(
						'aspect-square size-8 p-0',
						isTogglingExpand && 'animate-out fade-out-50 duration-200 ease-in-out'
					)}
					onPressedChange={toggleAllCardExpaned}>
					<Icon name={isAllCardsExpanded ? 'Minimize2' : 'Maximize2'} strokeWidth={2} />
				</Toggle>
			</Tooltip>
			<Separator className='h-4 w-0.5' orientation='vertical' />
			<Tooltip
				message={t('ns_common:actions.reload')}
				triggerProps={{
					asChild: true
				}}>
				<Button size='icon' variant='ghost' onClick={() => refetch()}>
					<Icon name='RefreshCcw' />
				</Button>
			</Tooltip>
			<Separator className='h-4 w-0.5' orientation='vertical' />
			<RoleBaseAccessControl authorizedRoles={[UserRole.MANAGER, UserRole.DG_WAREHOUSE_STAFF]} mode='mask'>
				<DeleteButton />
			</RoleBaseAccessControl>
		</Div>
	)
}

ActionButtonsGroup.displayName = 'ActionsBar'

export default ActionButtonsGroup
