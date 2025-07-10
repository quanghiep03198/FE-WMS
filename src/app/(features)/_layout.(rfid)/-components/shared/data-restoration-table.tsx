import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Checkbox,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
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

import { CheckedState } from '@radix-ui/react-checkbox'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import { useDeepCompareEffect } from 'ahooks'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RFIDDataType } from '../../-constants'
import { useDataRestorationContext } from '../../-contexts/data-sheet-context'
import { useGetArchivedEpcFeatureQuery, useGetArchivedEpcQuery } from '../../-hooks/use-data-restoration'
import DebouncedLimitInput from './debounced-limit-input'
import { GhostButton, ListDetail, ListDetailItem } from './styled'

type DataRestorationTableProps = React.ComponentProps<'div'> & { 'data-type': RFIDDataType; 'data-open': boolean }

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 5

const DataRestorationTable: React.FC<DataRestorationTableProps> = (props) => {
	const { t } = useTranslation()
	const {
		limit,
		selectedItems,
		searchTerm,
		advancedFilters,
		addItemToSet,
		removeItemFromSet,
		addAllItemsToSet,
		removeAllItemsFromSet
	} = useDataRestorationContext(
		'limit',
		'selectedItems',
		'addItemToSet',
		'addAllItemsToSet',
		'removeItemFromSet',
		'removeAllItemsFromSet',
		'searchTerm',
		'advancedFilters'
	)

	const { refetch: refetchArchivedEpcFeature } = useGetArchivedEpcFeatureQuery(props['data-type'])
	const {
		data,
		isFetching,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		refetch: refetchArchivedEpc,
		fetchNextPage
	} = useGetArchivedEpcQuery(props['data-type'], {
		limit,
		searchTerm,
		...advancedFilters
	})

	const datalist = useMemo(() => (Array.isArray(data) ? data : []), [data])

	useEffect(() => {
		addAllItemsToSet(datalist.filter((item) => selectedItems.some((selected) => selected.epc === item.epc)))
	}, [datalist])

	const [scrollElement, setScrollElement] = useState<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) {
			setScrollElement(node)
		}
	}, [])
	const getScrollElement = useCallback(() => scrollElement, [scrollElement])
	const scrollToFn = useScrollToFn({ current: scrollElement }, scrollingRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const measureElement = useMemo(() => {
		return props['data-open'] && typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
			? (element) => element?.getBoundingClientRect().height
			: undefined
	}, [props['data-open']])

	const virtualizer = useVirtualizer({
		count: datalist.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		scrollToFn,
		getScrollElement,
		estimateSize,
		measureElement
	})

	useDeepCompareEffect(() => {
		// * If the sheet is closed, there is no need to measure
		if (!props['data-open'] && scrollElement) return
		virtualizer.measure()
	}, [virtualizer, scrollElement, props['data-open']])

	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems?.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualItems?.length > 0
						? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems?.length - 1]).end
						: 0
				]
			: [0, 0]

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
			{...props}
			className='h-[40vh] space-y-1 overflow-y-auto !scroll-auto scrollbar-track-accent/10 xl:h-[55vh] xxl:h-[60vh]'
			ref={refCallback}>
			<Table
				className='border-separate border-spacing-0 [&_td]:border-x-0 [&_th]:border-x-0'
				style={
					{
						'--row-selection-width': '4rem',
						'--second-col-width': '15rem'
					} as React.CSSProperties
				}>
				<TableHeader className='sticky top-0 z-10 border-b [&_th]:bg-table-head [&_th]:text-table-head-foreground'>
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
						<TableHead className='align-middle'>
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<GhostButton onClick={() => handleRefetch()}>
									<Icon
										name={isFetching ? 'Loader' : 'RotateCw'}
										className={cn('h-full', isFetching && 'animate-[spin_1s_linear_infinite]')}
									/>
								</GhostButton>
							</Tooltip>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
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
							<TableCell colSpan={4} className='h-full'>
								<Div className='flex h-[calc(40vh-8rem)] items-center justify-center gap-x-3 xl:h-[calc(55vh-8rem)] xxl:h-[calc(60vh-8rem)]'>
									<Icon name='PackageOpen' size={36} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
									<Typography variant='small' color='muted' className='font-medium'>
										{t('ns_common:table.no_data')}
									</Typography>
								</Div>
							</TableCell>
						</TableRow>
					) : (
						<Fragment>
							{before > 0 && (
								<TableRow>
									<TableCell colSpan={4} style={{ height: before }} />
								</TableRow>
							)}
							{virtualItems.map((virtualItem) => {
								const item = datalist[virtualItem.index]
								const isSelected = selectedItems.some((epc) => epc.epc === item.epc)

								return (
									<TableRow
										key={virtualItem.key}
										data-index={virtualItem.index}
										aria-selected={isSelected}
										className={cn(
											'group/row transition-all duration-200 ease-in-out',
											isFetching ? 'opacity-50' : 'opacity-100'
										)}
										style={{ height: virtualItem.size }}>
										<TableCell className='group-aria-selected/row:bg-table-row-selected'>
											<Checkbox
												id={virtualItem.key.toString()}
												checked={isSelected}
												onCheckedChange={(checked) => {
													if (checked) {
														addItemToSet(item)
													} else {
														removeItemFromSet(item)
													}
												}}
											/>
										</TableCell>
										<TableCell align='left' className='group-aria-selected/row:bg-table-row-selected'>
											<Label htmlFor={virtualItem.key.toString()} className='cursor-pointer'>
												{item?.epc}
											</Label>
										</TableCell>
										<TableCell align='center' className='group-aria-selected/row:bg-table-row-selected'>
											{props['data-type'] === RFIDDataType.OUTBOUND ? (
												<Badge variant='outline' className='justify-center gap-x-2'>
													<Icon
														name={item.scanned ? 'Check' : 'CircleDashed'}
														size={14}
														className={item.scanned ? 'stroke-success' : 'stroke-muted-foreground'}
													/>
													{item.scanned ? t('ns_rfid:status.scanned') : t('ns_rfid:status.unscanned')}
												</Badge>
											) : (
												<Badge variant='outline' className='justify-center gap-x-2'>
													<Icon
														name={item.scannable ? 'Check' : 'X'}
														size={14}
														className={item.scannable ? 'stroke-success' : 'stroke-destructive'}
													/>
													{item.scannable
														? t('ns_rfid:status.scannable')
														: t('ns_rfid:status.unscannable')}
												</Badge>
											)}
										</TableCell>
										<TableCell className='group-aria-selected/row:bg-table-row-selected'>
											<HoverCard openDelay={100} closeDelay={100}>
												<HoverCardTrigger asChild>
													<GhostButton>
														<Icon name='Ellipsis' />
													</GhostButton>
												</HoverCardTrigger>
												<HoverCardContent
													align='start'
													side='left'
													sideOffset={8}
													className='w-full max-w-md rounded-md bg-popover text-popover-foreground'>
													<ListDetail>
														<ListDetailItem>
															{t('ns_erp:fields.mo_no')}:{' '}
															<Typography variant='small'>{item?.mo_no}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															{t('ns_erp:fields.shoestyle_codefactory')}:{' '}
															<Typography variant='small'>{item?.shoes_style_code_factory}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															{t('ns_erp:fields.color_sn')}:{' '}
															<Typography variant='small'>{item?.color_sn}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															Size: <Typography variant='small'>{item?.size_numcode}</Typography>
														</ListDetailItem>
													</ListDetail>
												</HoverCardContent>
											</HoverCard>
										</TableCell>
									</TableRow>
								)
							})}
							{after > 0 && (
								<TableRow>
									<TableCell colSpan={4} style={{ height: after }} />
								</TableRow>
							)}
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
												<Icon name='Plus' role='presentation' />
												{t('ns_common:actions.load_more')}
											</Button>
										)}
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					)}
				</TableBody>
				<TableFooter>
					<TableRow className='sticky -bottom-px z-10 [&_td]:border-x-0 [&_td]:border-t [&_td]:bg-table-head'>
						<TableCell colSpan={2}>
							<DebouncedLimitInput />
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
