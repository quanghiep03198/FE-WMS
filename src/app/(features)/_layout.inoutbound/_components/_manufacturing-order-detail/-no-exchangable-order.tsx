import { Div, Icon, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NoExchangeOrder: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='grid grid-cols-[4rem_auto] place-content-center gap-x-2 rounded-lg border px-4 py-10'>
			<Icon name='PackageOpen' size={48} className='stroke-foreground stroke-[1px] text-center' />
			<Div className='inline-flex flex-col items-start gap-1'>
				<Typography className='font-medium'>No available item</Typography>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:description.no_exchangable_order')}
				</Typography>
			</Div>
		</Div>
	)
}

export default NoExchangeOrder
