import formatIntlNumber from '@common/utils/format-intl-number'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@components/ui'
import { format } from 'date-fns'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StockFlow } from '../../constants/enums'
import type { IStockTransaction } from '../../types'
import { GhostButton } from '../styled'
import RollbackStockTransactionPopover from './rollback-stock-transaction-popover'

type StockTransactionRowProps<T = StockFlow> = {
	data: IStockTransaction<T>
	stockFlow: StockFlow
	size: number
	// virtualItem: VirtualItem
}

const StockTransactionRow: React.FC<StockTransactionRowProps> = ({ data, stockFlow, size }) => {
	const { t } = useTranslation()

	const sizeDetailData = useMemo(() => {
		if (!data?.detail) return []

		return Object.entries(data.detail)
			.sort(([size1], [size2]) => Number.parseFloat(size1) - Number.parseFloat(size2))
			.map(([size, detail]) => {
				const quantity = (() => {
					switch (data.tx_type) {
						case 'stock_in':
							return detail.stocked_in_qty
						case 'recall':
							return detail.total_recall_tx
						case 'stock_out':
							return detail.shipped_out_qty
						default:
							return 0
					}
				})()
				return {
					size,
					quantity
				}
			})
	}, [data?.detail])
	return (
		<TableRow
			className='group/row transition-all duration-200 ease-in-out group-aria-busy/body:opacity-50'
			style={{ height: size }}>
			<TableCell align='left' className='text-muted-foreground uppercase'>
				{data.id}
			</TableCell>
			<TableCell align='left' className='font-medium'>
				{stockFlow === StockFlow.OUTBOUND ? data.mo_no : data.mo_no}
			</TableCell>
			<TableCell align='left'>{t(`ns_inoutbound:action_types.${data.tx_type}`)}</TableCell>
			<TableCell align='left'>{format(new Date(data.tx_at), 'HH:mm:ss')}</TableCell>
			<TableCell align='left'>{formatIntlNumber(data.qty)} </TableCell>
			<TableCell align='left'>
				<RollbackStockTransactionPopover stockFlow={stockFlow} transactionId={data.id} />
			</TableCell>
			<TableCell align='left'>
				{sizeDetailData.length > 0 ? (
					<HoverCard openDelay={100} closeDelay={100}>
						<HoverCardTrigger asChild>
							<GhostButton>
								<Icon name='Ellipsis' />
							</GhostButton>
						</HoverCardTrigger>
						<HoverCardContent
							align='end'
							side='bottom'
							sideOffset={8}
							className='bg-popover text-popover-foreground devide-y flex w-full max-w-xs flex-col rounded-md'>
							<Table className='table-fixed [&_tr>*:is(th,td)]:border-l-0'>
								<TableHeader>
									<TableRow className='[&>th]:bg-table-head'>
										<TableHead align='left'>Size</TableHead>
										<TableHead align='left'>{t('ns_common:common_fields.quantity')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sizeDetailData.map(({ size, quantity }) => {
										return (
											<TableRow key={size}>
												<TableCell
													align='left'
													className='before:text-muted-foreground before:content-["#"]'>
													{size}
												</TableCell>
												<TableCell align='left'>{formatIntlNumber(quantity)} (prs)</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</HoverCardContent>
					</HoverCard>
				) : (
					<Icon name='Ellipsis' className='stroke-muted-foreground' />
				)}
			</TableCell>
		</TableRow>
	)
}

const MemoizedStockTransactionRow = memo(StockTransactionRow)

export { MemoizedStockTransactionRow, StockTransactionRow }
