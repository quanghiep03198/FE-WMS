import { Button, Div, Icon, Separator, Tooltip } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetDefectiveGoodsQuery } from '../../../-hooks/use-defective-goods-asm'
import DeleteButton from './delete-button'

const ActionButtonsGroup: React.FC = () => {
	const { t } = useTranslation()
	const { refetch } = useGetDefectiveGoodsQuery()

	return (
		<Div className='ml-auto flex flex-1 items-center justify-end gap-x-1'>
			<Tooltip
				message={t('ns_common:actions.reload')}
				triggerProps={{
					asChild: true
				}}>
				<Button size='icon' variant='ghost' onClick={() => refetch()}>
					<Icon name='RotateCcw' />
				</Button>
			</Tooltip>
			<Separator orientation='vertical' className='h-4 w-0.5' />
			<DeleteButton />
		</Div>
	)
}

ActionButtonsGroup.displayName = 'ActionsBar'

export default ActionButtonsGroup
