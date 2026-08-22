'use no memo'

import { cn } from '@common/utils/cn'
import {
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography
} from '@components/ui'
import AutoComplete from '@components/ui/@custom/auto-complete'
import Skeleton from '@components/ui/@custom/skeleton'
import { VirtualPlaceholderRow } from '@components/ui/@react-table/components/table-row'
import { useGetCurrentStockTransactionQuery } from '@features/finished-goods/hooks/use-stock-transaction-request'
import useScrollToFn from '@hooks/use-scroll-fn'
import useVirtualScrollPadding from '@hooks/use-virtual-scroll-padding'
import { useVirtualizer } from '@tanstack/react-virtual'
import { pick, uniqBy } from 'lodash-es'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StockFlow } from '../../constants/enums'
import { GhostButton } from '../styled'
import { MemoizedStockTransactionRow, StockTransactionRow } from './stock-transaction-row'

type StockTransactionHistoryTableProps = { stockFlow: StockFlow }

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 5

const ORDER_FIELD_MAP: Map<StockFlow, 'mo_no' | 'po'> = new Map([
	[StockFlow.INBOUND, 'mo_no'],
	[StockFlow.OUTBOUND, 'po']
])

const StockTransactionHistoryTable: React.FC<StockTransactionHistoryTableProps> = ({ stockFlow }) => {
	const { t } = useTranslation()

	const { data, isLoading, isFetching, refetch } = useGetCurrentStockTransactionQuery(stockFlow)

	const [search, setSearch] = useState<string>('')

	const filteredData = useMemo(() => {
		return Array.isArray(data)
			? data.filter((item) => item.mo_no.toLocaleLowerCase().includes(search.toLowerCase()))
			: []
	}, [data, search])

	const [scrollElement, setScrollElement] = useState<HTMLDivElement>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) setScrollElement(node)
	}, [])
	const getScrollElement = useCallback(() => scrollElement, [scrollElement])
	const scrollToFn = useScrollToFn({ current: scrollElement })
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])

	const virtualizer = useVirtualizer({
		count: filteredData.length,
		overscan: PRERENDERED_ITEMS,
		scrollToFn,
		getScrollElement,
		estimateSize
	})

	const { before, after } = useVirtualScrollPadding(virtualizer)

	const virtualItems = virtualizer.getVirtualItems()

	const orderField = ORDER_FIELD_MAP.get(stockFlow)

	const autoCompleteDatalist = useMemo(() => {
		return Array.isArray(data) ? uniqBy(data, orderField).map((item) => pick(item, orderField)) : []
	}, [data, stockFlow])

	return (
		<Div className='flex h-full flex-col gap-6'>
			<Div className='relative overflow-clip rounded-md border'>
				<Icon name='Search' className='absolute top-1/2 left-3 z-10 -translate-y-1/2' />
				<AutoComplete
					datalist={autoCompleteDatalist}
					className='border-none! pl-10'
					shouldFilter={true}
					labelField={orderField}
					valueField={orderField}
					value={search}
					onInput={(value) => setSearch(value)}
					placeholder={t('ns_common:actions.search') + '...'}
				/>
			</Div>
			<Div
				className='scrollbar-track-accent/10 flex-1 space-y-1 overflow-y-auto'
				style={{
					container: 'table / size'
				}}
				ref={refCallback}>
				<Table
					className='w-full table-fixed border-separate border-spacing-0 [&_td]:border-x-0 [&_th]:border-x-0'
					style={
						{
							'--header-height': '3rem',
							'--footer-height': '3rem'
						} as React.CSSProperties
					}>
					<TableHeader className='[&_th]:bg-table-head [&_th]:text-table-head-foreground sticky top-0 z-10 border-b [&_th]:h-(--header-height)'>
						<TableRow>
							<TableHead align='left' style={{ width: '10%' }}>
								#ID
							</TableHead>
							<TableHead align='left' style={{ width: '20%' }} title={t(`ns_erp:fields.${orderField}`)}>
								<span className='line-clamp-1'>{t(`ns_erp:fields.${orderField}`)}</span>
							</TableHead>
							<TableHead align='left' style={{ width: '20%' }}>
								{t('ns_common:common_fields.created_at')}
							</TableHead>
							<TableHead align='left' style={{ width: '20%' }}>
								{t('ns_common:common_fields.quantity')}
							</TableHead>
							<TableHead align='left' style={{ width: '20%' }}>
								{t('ns_common:common_fields.actions')}
							</TableHead>
							<TableHead align='left' style={{ width: '10%' }}>
								<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
									<GhostButton onClick={() => refetch()}>
										<Icon
											name={isFetching ? 'Loader' : 'RefreshCcw'}
											className={cn('h-full', isFetching && 'animate-spin')}
										/>
									</GhostButton>
								</Tooltip>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='group/body' aria-busy={isFetching}>
						{isLoading ? (
							Array.from({ length: 10 }, (_, i) => (
								<TableRow key={i.toString()}>
									{Array.from({ length: 4 }, (_, j) => (
										<TableCell key={`${i}.${j}`} className='h-9'>
											<Skeleton />
										</TableCell>
									))}
								</TableRow>
							))
						) : !Array.isArray(filteredData) || filteredData?.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className='h-[calc(100cqh-var(--header-height)-var(--footer-height)-2*var(--border-width,1px))]'>
									<Div className='flex h-full items-center justify-center gap-x-3'>
										<Icon name='PackageOpen' size={36} strokeWidth={1} stroke='var(--muted-foreground)' />
										<Typography variant='small' color='muted' className='font-medium'>
											{t('ns_common:table.no_data')}
										</Typography>
									</Div>
								</TableCell>
							</TableRow>
						) : (
							<Fragment>
								{before > 0 && <VirtualPlaceholderRow colSpan={4} style={{ height: before }} />}
								{virtualItems.map((virtualItem) => {
									const item = data[virtualItem.index]
									return virtualizer.isScrolling ? (
										<MemoizedStockTransactionRow
											key={item.id}
											data={item}
											stockFlow={stockFlow}
											size={virtualItem.size}
										/>
									) : (
										<StockTransactionRow
											key={item.id}
											data={item}
											stockFlow={stockFlow}
											size={virtualItem.size}
										/>
									)
								})}

								{after > 0 && <VirtualPlaceholderRow colSpan={4} style={{ height: after }} />}
							</Fragment>
						)}
					</TableBody>
					<TableFooter>
						<TableRow className='[&_td]:bg-table-head sticky bottom-0 z-10 [&_td]:h-(--footer-height) [&_td]:border-x-0 [&_td]:border-t'>
							<TableCell align='left' colSpan={6}>
								{t('ns_common:table.total_rows', { count: filteredData?.length ?? 0, defaultValue: null })}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</Div>
		</Div>
	)
}

export default StockTransactionHistoryTable
