'use no memo'

import {
	Button,
	Checkbox,
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
} from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { VirtualPlaceholderRow } from '@/components/ui/@react-table/components/table-row'
import useScrollToFn from '@/hooks/use-scroll-fn'
import useVirtualScrollPadding from '@/hooks/use-virtual-scroll-padding'
import { cn } from '@common/utils/cn'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScanCapability, ScannedStatus, StockFlow } from '../../constants/enums'
import { useDataRestorationContext } from '../../contexts/data-restoration-context'
import { useGetDeletedEpcQuery, useGetDeletedEpcSpecsQuery } from '../../hooks/use-deleted-epc-request'
import type { SearchFormValues } from '../../hooks/use-persistent-filter-state'
import { usePersistentFilterState } from '../../hooks/use-persistent-filter-state'
import { DataRestorationRow, MemoizedDataRestorationRow } from './data-restoration-row'
import DebouncedLimitInput from './debounced-limit-input'
import { GhostButton } from './styled'

type DataRestorationTableProps = { dataType: StockFlow }

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 5

const DataRestorationTable: React.FC<DataRestorationTableProps> = ({ dataType }) => {
	const { t } = useTranslation()
	const { selectedItems, addAllItemsToSet, removeAllItemsFromSet } = useDataRestorationContext(
		'selectedItems',
		'addAllItemsToSet',
		'removeAllItemsFromSet'
	)
	const [persistentFormValues] = usePersistentFilterState(dataType)
	const { refetch: refetchArchivedEpcFeature } = useGetDeletedEpcSpecsQuery()
	const {
		data,
		isFetching,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		refetch: refetchArchivedEpc,
		fetchNextPage
	} = useGetDeletedEpcQuery(dataType, {
		...persistentFormValues,
		...(dataType === StockFlow.INBOUND && {
			scannable:
				persistentFormValues.scanned === 'all' ? null : persistentFormValues.scannable === ScanCapability.SCANNABLE
		}),
		...(dataType === StockFlow.OUTBOUND && {
			scanned: persistentFormValues.scanned === 'all' ? null : persistentFormValues.scanned === ScannedStatus.SCANNED
		})
	} as SearchFormValues & {
		limit: number
		scanned?: boolean | null
		scannable?: boolean | null
	})

	const datalist = useMemo(() => (Array.isArray(data) ? data : []), [data])

	useEffect(() => {
		addAllItemsToSet(datalist.filter((item) => selectedItems.some((selected) => selected.epc === item.epc)))
	}, [datalist])

	const [scrollElement, setScrollElement] = useState<HTMLDivElement>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) setScrollElement(node)
	}, [])
	const getScrollElement = useCallback(() => scrollElement, [scrollElement])
	const scrollToFn = useScrollToFn({ current: scrollElement })
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])

	const virtualizer = useVirtualizer({
		count: datalist.length,
		overscan: PRERENDERED_ITEMS,
		scrollToFn,
		getScrollElement,
		estimateSize
	})

	const { before, after } = useVirtualScrollPadding(virtualizer)

	const virtualItems = virtualizer.getVirtualItems()

	const handleFetchNextPage = () => {
		const [lastItem] = [...virtualItems].reverse()
		if (!lastItem) return
		if (lastItem.index >= datalist.length - 1 && hasNextPage && !isFetchingNextPage) fetchNextPage()
	}

	const handleRefetch = () => {
		refetchArchivedEpcFeature()
		refetchArchivedEpc()
	}

	const isSomeItemsSelected = selectedItems.length > 0 && selectedItems.length < datalist.length
	const isAllItemsSelected = selectedItems.length > 0 && selectedItems.length === datalist.length

	return (
		<Div
			className='flex-1 space-y-1 overflow-y-auto scrollbar-track-accent/10'
			style={{
				container: 'table / size'
			}}
			ref={refCallback}>
			<Table
				className='border-separate border-spacing-0 [&_td]:border-x-0 [&_th]:border-x-0'
				style={
					{
						'--row-selection-width': '4rem',
						'--second-col-width': '15rem',
						'--header-height': '3rem',
						'--footer-height': '3rem'
					} as React.CSSProperties
				}>
				<TableHeader className='sticky top-0 z-10 border-b [&_th]:h-[--header-height] [&_th]:bg-table-head [&_th]:text-table-head-foreground'>
					<TableRow>
						<TableHead className='w-[var(--row-selection-width)]'>
							<Checkbox
								role='checkbox'
								checked={(isAllItemsSelected || (isSomeItemsSelected && 'indeterminate')) as CheckedState}
								onCheckedChange={(checked) => {
									if (checked) addAllItemsToSet(datalist)
									else removeAllItemsFromSet()
								}}
							/>
						</TableHead>
						<TableHead align='left' className='w-[var(--second-col-width)]'>
							EPC
						</TableHead>
						<TableHead align='center'>{t('ns_common:common_fields.status')}</TableHead>
						<TableHead align='center' className='align-middle'>
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<GhostButton onClick={() => handleRefetch()}>
									<Icon
										name={isFetching ? 'Loader' : 'RefreshCcw'}
										className={cn('h-full', isFetching && 'animate-[spin_1s_linear_infinite]')}
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
					) : !Array.isArray(datalist) || datalist?.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className='h-[calc(100cqh-var(--header-height)-var(--footer-height)-2*var(--border-width,1px))]'>
								<Div className='flex h-full items-center justify-center gap-x-3'>
									<Icon name='PackageOpen' size={36} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
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
								const item = datalist[virtualItem.index]
								return virtualizer.isScrolling ? (
									<MemoizedDataRestorationRow
										key={item.epc}
										data={item}
										dataType={dataType}
										size={virtualItem.size}
									/>
								) : (
									<DataRestorationRow key={item.epc} data={item} dataType={dataType} size={virtualItem.size} />
								)
							})}
							{hasNextPage && (
								<TableRow>
									<TableCell colSpan={4} align='center' className='h-10 text-muted-foreground'>
										{isFetchingNextPage ? (
											<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
										) : (
											<Button
												variant='link'
												size='lg'
												disabled={isFetching}
												onClick={() => handleFetchNextPage()}>
												<Icon name='Plus' />
												{t('ns_common:actions.load_more')}
											</Button>
										)}
									</TableCell>
								</TableRow>
							)}
							{after > 0 && <VirtualPlaceholderRow colSpan={4} style={{ height: after }} />}
						</Fragment>
					)}
				</TableBody>
				<TableFooter>
					<TableRow className='sticky bottom-0 z-10 [&_td]:h-[--footer-height] [&_td]:border-x-0 [&_td]:border-t [&_td]:bg-table-head'>
						<TableCell colSpan={2}>
							<DebouncedLimitInput dataType={dataType} />
						</TableCell>
						<TableCell align='right' colSpan={2}>
							{t('ns_common:table.selected_rows', {
								selectedRows: `${selectedItems?.length}/${datalist?.length ?? 0}`,
								defaultValue: null
							})}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</Div>
	)
}

export default DataRestorationTable
