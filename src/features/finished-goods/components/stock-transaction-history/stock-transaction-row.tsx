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

type StockTransactionRowProps<T extends StockFlow> = {
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

const StockTransactionRow: React.FC<StockTransactionRowProps<StockFlow>> = ({ data, stockFlow, size }) => {
	const { t } = useTranslation()

	const details = useMemo(() => {
		if (typeof data.changes === 'undefined' || data.changes === null) return []

		if (!Array.isArray(data.changes) && typeof data.changes === 'object')
			return Object.entries<{ stocked_in_qty: number; total_recall_tx: number }>(
				data.changes as IStockTransaction<StockFlow.INBOUND>['changes']
			)
				.sort(([size1], [size2]) => Number.parseFloat(size1) - Number.parseFloat(size2))
				.map(([size, detail]) => {
					const quantity = (() => {
						switch (data.tx_type) {
							case 'stock_in':
								return detail.stocked_in_qty
							case 'recall':
								return detail.total_recall_tx

							default:
								return 0
						}
					})()
					return {
						size,
						quantity
					}
				})

		if (Array.isArray(data.changes))
			return (data.changes as IStockTransaction<StockFlow.OUTBOUND>['changes']).map((item) => ({
				mo_no: item.mo_no,
				size_ledger: Object.entries<{ shipped_out_qty: number }>(item.size_ledger)
					.sort(([size1], [size2]) => Number.parseFloat(size1) - Number.parseFloat(size2))
					.map(([size, detail]) => ({
						size,
						quantity: detail.shipped_out_qty
					}))
			}))
	}, [data?.changes])

	const directionCoefficient = TX_DIRECTION_COEFFICIENT.get(data.tx_type) ?? 1

	return (
		<TableRow
			aria-disabled={data.voided || !data.reversible}
			className='group/row transition-all duration-200 ease-in-out group-aria-busy/body:opacity-50 [&[aria-disabled=true]_*:not(button)]:line-through [&[aria-disabled=true]>td:not(:has(button))]:opacity-50'
			style={{ height: size }}>
			<TableCell align='left' className='before:text-muted-foreground uppercase before:mr-1 before:content-["#"]'>
				{data.id}
			</TableCell>
			<TableCell align='left'>
				<Typography variant='small' className='inline-flex items-center gap-2'>
					<Icon name={BADGE_PROPS.get(data.tx_type)!.icon} stroke={BADGE_PROPS.get(data.tx_type)!.color} />
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
					reversible={data.reversible}
				/>
			</TableCell>
			<TableCell align='right'>
				{Array.isArray(details) && details.length > 0 ? (
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
							className='bg-popover text-popover-foreground flex w-160 flex-col rounded-md'>
							<Table className='table-fixed border-collapse [&_th,td]:border'>
								<TableHeader>
									<TableRow className='[&>th]:bg-table-head'>
										{stockFlow === 'outbound' && (
											<TableHead scope='col' align='left'>
												{t('ns_erp:fields.mo_no')}
											</TableHead>
										)}
										<TableHead scope='col' align='left'>
											Size
										</TableHead>
										<TableHead scope='col' align='left'>
											{t('ns_common:common_fields.quantity')}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className='[&_tr:last-child>*:first-child]:border-b-0!'>
									{details.map((item) => {
										if (Array.isArray(item.size_ledger) && Object.hasOwn(item, 'mo_no'))
											return item.size_ledger.map((i, idx) => (
												<TableRow key={i.mo_no} className='last:[&>td]:border-b-0!'>
													{idx === 0 && (
														<TableCell
															align='left'
															scope='col'
															rowSpan={item.size_ledger.length}
															className='border-b-0!'>
															{item.mo_no}
														</TableCell>
													)}
													<TableCell
														align='left'
														scope='col'
														className='before:text-muted-foreground before:content-["#"]'>
														{i.size}
													</TableCell>
													<TableCell align='left' scope='col'>
														{formatIntlNumber(i.quantity * directionCoefficient)} (prs)
													</TableCell>
												</TableRow>
											))

										return (
											<TableRow key={item.size}>
												<TableCell
													align='left'
													scope='col'
													className='before:text-muted-foreground before:content-["#"]'>
													{item?.size}
												</TableCell>
												<TableCell align='left' scope='col'>
													{formatIntlNumber(item.quantity * directionCoefficient)} (prs)
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
