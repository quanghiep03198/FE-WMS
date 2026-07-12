import RoleBaseAccessControl from '@/components/guards/role-base-access-control'
import { Button, Div, Icon, Separator, Toggle, Tooltip } from '@/components/ui'
import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
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
					variant='default'
					className={cn(
						'aspect-square size-8 p-0',
						isTogglingExpand && 'duration-200 ease-in-out animate-out fade-out-50'
					)}
					pressed={!isAllCardsExpanded}
					onPressedChange={toggleAllCardExpaned}>
					<Icon name={isAllCardsExpanded ? 'Minimize2' : 'Maximize2'} strokeWidth={2} />
				</Toggle>
			</Tooltip>
			<Separator orientation='vertical' className='h-4 w-0.5' />
			<Tooltip
				message={t('ns_common:actions.reload')}
				triggerProps={{
					asChild: true
				}}>
				<Button size='icon' variant='ghost' onClick={() => refetch()}>
					<Icon name='RefreshCcw' />
				</Button>
			</Tooltip>
			<Separator orientation='vertical' className='h-4 w-0.5' />
			<RoleBaseAccessControl mode='mask' authorizedRoles={[UserRole.MANAGER, UserRole.DG_WAREHOUSE_STAFF]}>
				<DeleteButton />
			</RoleBaseAccessControl>
		</Div>
	)
}

ActionButtonsGroup.displayName = 'ActionsBar'

export default ActionButtonsGroup
