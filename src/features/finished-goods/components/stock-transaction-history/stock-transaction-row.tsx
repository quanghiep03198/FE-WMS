import formatIntlNumber from '@common/utils/format-intl-number'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	type IconProps,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@components/ui'
import { format } from 'date-fns'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StockFlow } from '../../constants/enums'
import type { IStockTransaction, StockTransactionType } from '../../types'
import { GhostButton } from '../styled'
import RollbackStockTransactionPopover from './rollback-stock-transaction-popover'

type StockTransactionRowProps<T = StockFlow> = {
	data: IStockTransaction<T>
	stockFlow: StockFlow
	size: number
	// virtualItem: VirtualItem
}

const BADGE_PROPS: Map<StockTransactionType, { icon: IconProps['name']; color: string }> = new Map([
	['stock_in', { icon: 'LogIn', color: 'var(--active)' }],
	['recall', { icon: 'LogOut', color: 'var(--destructive)' }],
	['stock_out', { icon: 'LogOut', color: 'var(--active)' }]
])

const TX_DIRECTION_COEFFICIENT: Map<StockTransactionType, number> = new Map([
	['stock_in', 1],
	['recall', -1],
	['stock_out', 1]
])

const StockTransactionRow: React.FC<StockTransactionRowProps> = ({ data, stockFlow, size }) => {
	const { t } = useTranslation()

	const sizeDetailData = useMemo(() => {
		if (!data?.changes) return []

		return Object.entries(data.changes)
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
	}, [data?.changes])

	const directionCoefficient = TX_DIRECTION_COEFFICIENT.get(data.tx_type) ?? 1

	return (
		<TableRow
			aria-disabled={data.reversed || !data.can_rollback}
			className='group/row transition-all duration-200 ease-in-out group-aria-busy/body:opacity-50 [&[aria-disabled=true]_*:not(button)]:line-through [&[aria-disabled=true]>td:not(:has(button))]:opacity-50'
			style={{ height: size }}>
			<TableCell align='left' className='before:text-muted-foreground uppercase before:mr-1 before:content-["#"]'>
				{data.id}
			</TableCell>
			<TableCell align='left'>
				<Typography variant='small' className='inline-flex items-center gap-2'>
					<Icon name={BADGE_PROPS.get(data.tx_type).icon} stroke={BADGE_PROPS.get(data.tx_type).color} />
					{stockFlow === StockFlow.OUTBOUND ? data.po : data.mo_no}
				</Typography>
			</TableCell>
			<TableCell align='left'>{formatIntlNumber(data.qty * directionCoefficient)} </TableCell>
			<TableCell align='left'>
				<Typography variant='small' className='inline-flex items-center gap-2'>
					<Icon name='Clock' stroke='var(--muted-foreground)' />
					{format(new Date(data.tx_at), 'HH:mm:ss')}
				</Typography>
			</TableCell>
			<TableCell align='left'>
				<RollbackStockTransactionPopover
					stockFlow={stockFlow}
					transactionId={data.id}
					canRollback={data.can_rollback}
				/>
			</TableCell>
			<TableCell align='right'>
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
							className='bg-popover text-popover-foreground devide-y flex w-full max-w-64 flex-col rounded-md'>
							<Table className='table-fixed [&_tr>*:is(th,td)]:border-l-0'>
								<TableHeader>
									<TableRow className='[&>th]:bg-table-head'>
										<TableHead scope='col' align='left'>
											Size
										</TableHead>
										<TableHead scope='col' align='left'>
											{t('ns_common:common_fields.quantity')}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sizeDetailData.map(({ size, quantity }) => {
										return (
											<TableRow key={size}>
												<TableCell
													align='left'
													scope='col'
													className='before:text-muted-foreground before:content-["#"]'>
													{size}
												</TableCell>
												<TableCell align='left' scope='col'>
													{formatIntlNumber(quantity * directionCoefficient)} (prs)
												</TableCell>
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
