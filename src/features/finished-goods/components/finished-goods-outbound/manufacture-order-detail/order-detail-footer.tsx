import { Div, Separator, Typography } from '@components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

type OrderDetailTableFooterProps = {
	totalFilteredQty: string
}

const OrderDetailTableFooter: React.FC<OrderDetailTableFooterProps> = ({ totalFilteredQty }) => {
	const { t } = useTranslation()

	return (
		<Div className='text-muted-foreground flex basis-(--table-footer-height) items-center justify-center gap-x-2 p-3 px-4 text-center text-sm'>
			<Typography variant='small'>{t('ns_inoutbound:description.inoutbound_table_caption')}</Typography>
			<Div className='bg-background inline-flex flex-1 items-center justify-end gap-x-2'>
				<Typography className='font-medium' color='muted'>
					{t('ns_common:common_fields.total')}
				</Typography>
				<Separator className='h-0.5 basis-4' orientation='horizontal' />
				<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
					{totalFilteredQty}
					<Typography variant='small'>pcs</Typography>
				</Typography>
			</Div>
		</Div>
	)
}

export default OrderDetailTableFooter
