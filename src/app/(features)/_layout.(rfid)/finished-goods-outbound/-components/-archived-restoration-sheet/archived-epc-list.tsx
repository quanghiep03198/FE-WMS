import useScrollToFn from '@/common/hooks/use-scroll-fn'
import {
	Badge,
	Checkbox,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
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
import { CheckedState } from '@radix-ui/react-checkbox'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useArchivedRestorationContext } from '../../-contexts/archived-sheet-context'
import { useGetArchivedEpcFeatureQuery, useGetArchivedEpcQuery } from '../../-hooks'
import DebouncedLimitInput from './debounced-limit-input'
import { GhostButton, ListDetail, ListDetailItem } from './styled'

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 0

const ArchivedEpcList: React.FC = () => {
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
	} = useArchivedRestorationContext(
		'limit',
		'selectedItems',
		'addItemToSet',
		'addAllItemsToSet',
		'removeItemFromSet',
		'removeAllItemsFromSet',
		'searchTerm',
		'advancedFilters'
	)

	console.log('advancedFilters :>> ', advancedFilters)

	const { refetch: refetchArchivedEpcFeature } = useGetArchivedEpcFeatureQuery()
	const {
		data,
		hasNextPage,
		isFetchingNextPage,
		refetch: refetchArchivedEpc,
		fetchNextPage
	} = useGetArchivedEpcQuery({
		limit,
		searchTerm,
		...advancedFilters
	})

	const datalist = useMemo(() => (Array.isArray(data) ? data : []), [data])

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

	const virtualizer = useVirtualizer({
		count: datalist.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		scrollToFn,
		getScrollElement,
		estimateSize,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? useCallback((element) => element?.getBoundingClientRect().height, [])
				: undefined
	})

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

	useEffect(() => {
		const [lastItem] = [...virtualItems].reverse()
		if (!lastItem) return
		if (lastItem.index >= datalist.length - 1 && hasNextPage && !isFetchingNextPage) fetchNextPage()
	}, [hasNextPage, fetchNextPage, datalist.length, isFetchingNextPage, virtualItems])

	const handleRefetch = () => {
		refetchArchivedEpcFeature()
		refetchArchivedEpc()
	}

	const isSomeItemsSelected = selectedItems.length > 0 && selectedItems.length < datalist.length
	const isAllItemsSelected = selectedItems.length > 0 && selectedItems.length === datalist.length

	return (
		<Fragment>
			<Div
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
										if (checked) addAllItemsToSet(data)
										else removeAllItemsFromSet()
									}}
								/>
							</TableHead>
							<TableHead align='left' className='w-[var(--second-col-width)]'>
								EPC
							</TableHead>
							<TableHead align='center'>{t('ns_common:common_fields.status')}</TableHead>
							<TableHead>
								<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
									<GhostButton onClick={() => handleRefetch()}>
										<Icon name='RotateCw' />
									</GhostButton>
								</Tooltip>
							</TableHead>
						</TableRow>
					</TableHeader>
					{!Array.isArray(datalist) || datalist?.length === 0 ? (
						<Div className='flex h-[50vh] flex-col place-content-center items-center justify-center space-y-2'>
							<Icon name='PackageOpen' size={44} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
							<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
						</Div>
					) : (
						<TableBody>
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
										className='group/row'
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
											{item?.epc}
										</TableCell>
										<TableCell align='center' className='group-aria-selected/row:bg-table-row-selected'>
											<Badge variant='outline' className='justify-center gap-x-2'>
												<Icon
													name={item.scanned ? 'Check' : 'CircleDashed'}
													size={14}
													className={item.scanned ? 'stroke-success' : 'stroke-muted-foreground'}
												/>
												{item.scanned ? 'Scanned' : 'Unscanned'}
											</Badge>
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
									<TableCell colSpan={4} align='center' className='py-6 text-muted-foreground'>
										<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)}
					<TableFooter>
						<TableRow className='sticky bottom-0 z-10 [&_td]:border-x-0 [&_td]:border-t'>
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
		</Fragment>
	)
}

export default ArchivedEpcList
