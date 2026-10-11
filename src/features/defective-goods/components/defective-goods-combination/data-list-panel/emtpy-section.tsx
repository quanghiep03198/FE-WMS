import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import PlaceHolderItems from '@components/shared/placeholder-items'
import React from 'react'
import { useTranslation } from 'react-i18next'

const EmptySection: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='h-full place-content-center place-items-center p-10'>
			<Div className='flex flex-col items-center justify-center gap-y-2'>
				<PlaceHolderItems />
				<Typography>{t('ns_common:table.no_data')}</Typography>
				<Typography className='text-center text-pretty' color='muted' variant='small'>
					{t('ns_inoutbound:description.empty_defect_item_caption')}
				</Typography>
			</Div>
		</Div>
	)
}

export default EmptySection
