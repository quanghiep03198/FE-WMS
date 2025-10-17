import PlaceHolderItems from '@/app/(features)/-components/-shared/placeholder-items'
import { Div, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const EmptySection: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='h-full place-content-center place-items-center p-10'>
			<Div className='flex flex-col items-center justify-center gap-y-2'>
				<PlaceHolderItems />
				<Typography>{t('ns_common:table.no_data')}</Typography>
				<Typography variant='small' color='muted' className='text-pretty text-center'>
					{t('ns_inoutbound:description.empty_defect_item_caption')}
				</Typography>
			</Div>
		</Div>
	)
}

export default EmptySection
