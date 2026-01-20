import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlaceHolderItems from '../../-components/shared/placeholder-items'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'

const EmptyHistory: React.FC = () => {
	const { t } = useTranslation()
	const { removeParam } = useQueryParams<{ order?: string; type: RFIDDataType }>()

	return (
		<Empty className='mx-auto h-full max-w-4xl border border-dashed'>
			<EmptyHeader>
				<PlaceHolderItems className='w-full' />
				<EmptyTitle>{t('ns_common:table.no_data')}</EmptyTitle>
				<EmptyDescription className='text-pretty'>
					{t('ns_inoutbound:description.inoutbound_history_not_found')}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant='outline' size='sm' onClick={() => removeParam('order')}>
					<Icon name='Undo2' />
					{t('ns_common:actions.retry')}
				</Button>
			</EmptyContent>
		</Empty>
	)
}

export default EmptyHistory
