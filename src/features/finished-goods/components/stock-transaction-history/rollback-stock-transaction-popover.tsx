import { Button, Div, Icon, Popover, PopoverContent, PopoverTrigger, Typography } from '@components/ui'
import type { StockFlow } from '@features/finished-goods/constants/enums'
import { useRollbackStockTransactionMutation } from '@features/finished-goods/hooks/use-stock-transaction-request'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RollbackStockTransactionPopover: React.FC<{
	stockFlow: StockFlow
	transactionId: string
	canRollback: boolean
}> = ({ stockFlow, transactionId, canRollback }) => {
	const { t } = useTranslation()

	const { mutateAsync, isPending, isError } = useRollbackStockTransactionMutation(stockFlow)

	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button variant='destructive' size='xs' disabled={!canRollback || isPending}>
					{t('ns_common:actions.rollback')}
				</Button>
			</PopoverTrigger>

			<PopoverContent className='flex w-full max-w-sm items-start gap-6' align='end'>
				<Div className='bg-destructive/10 text-destructive flex aspect-square size-12 items-center justify-center rounded-full'>
					<Icon name='TriangleAlert' size={20} />
				</Div>
				<Div className='flex flex-1 flex-col gap-y-1.5'>
					<Typography className='font-medium'>{t('ns_inoutbound:titles.rollback_stock_transaction')}</Typography>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:description.rollback_stock_transaction')}
					</Typography>
					<Button
						variant='destructive'
						size='sm'
						className='mt-3'
						disabled={!canRollback || isPending}
						onClick={() => mutateAsync(transactionId)}>
						{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
						{t(isError ? 'ns_common:actions.retry' : 'ns_common:actions.confirm')}
					</Button>
				</Div>
			</PopoverContent>
		</Popover>
	)
}

export default RollbackStockTransactionPopover
