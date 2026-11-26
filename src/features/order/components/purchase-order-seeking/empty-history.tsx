import { Button } from '@components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@components/ui/empty'
import { Icon } from '@components/ui/icon'
import useQueryParams from '@hooks/use-query-params'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlaceHolderItems from '../../../../components/shared/placeholder-items'

const EmptySearchResult: React.FC = () => {
	const { t } = useTranslation()
	const { removeParam } = useQueryParams<{ po?: string }>()

	return (
		<Empty className='mx-auto max-h-fit w-full border border-dashed'>
			<EmptyHeader>
				<PlaceHolderItems className='w-full' />
				<EmptyTitle>{t('ns_common:table.no_data')}</EmptyTitle>
				<EmptyDescription className='text-pretty'>
					{t('ns_erp:descriptions.no_purchase_order_found')}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size='sm' variant='outline' onClick={() => removeParam('po')}>
					<Icon name='Undo2' />
					{t('ns_common:actions.retry')}
				</Button>
			</EmptyContent>
		</Empty>
	)
}

export default EmptySearchResult
