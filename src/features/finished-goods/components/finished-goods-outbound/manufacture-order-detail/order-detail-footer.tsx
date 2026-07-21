import { Div, Separator, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

type OrderDetailTableFooterProps = {
	totalFilteredQty: string
}

const OrderDetailTableFooter: React.FC<OrderDetailTableFooterProps> = ({ totalFilteredQty }) => {
	const { t } = useTranslation()

	return (
		<Div className='flex basis-(--table-footer-height) items-center justify-center gap-x-2 p-3 px-4 text-center text-sm text-muted-foreground'>
			<Typography variant='small'>{t('ns_inoutbound:description.inoutbound_table_caption')}</Typography>
			<Div className='inline-flex flex-1 items-center justify-end gap-x-2 bg-background'>
				<Typography color='muted' className='font-medium'>
					{t('ns_common:common_fields.total')}
				</Typography>
				<Separator orientation='horizontal' className='h-0.5 basis-4' />
				<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
					{totalFilteredQty}
					<Typography variant='small'>pcs</Typography>
				</Typography>
			</Div>
		</Div>
	)
}

export default OrderDetailTableFooter
