import { Div, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NoExchangeOrder: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='grid place-content-center gap-x-2 rounded-lg border px-4 py-10'>
			<Div className='inline-flex flex-col items-center gap-0.5'>
				<Typography className='font-medium'>No available item</Typography>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:description.no_exchangable_order')}
				</Typography>
			</Div>
		</Div>
	)
}

export default NoExchangeOrder
