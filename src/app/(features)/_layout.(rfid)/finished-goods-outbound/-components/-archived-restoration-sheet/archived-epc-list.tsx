import useScrollToFn from '@/common/hooks/use-scroll-fn'
import {
	Checkbox,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Tooltip,
	Typography
} from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useArchivedRestorationContext } from '../../-contexts/archived-sheet-context'
import { useGetArchivedEpcFeatureQuery, useGetArchivedEpcQuery } from '../../-hooks'
import { GhostButton, ListBody, ListContainer, ListDetail, ListDetailItem, ListHeader, ListItem } from './styled'

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 0

const ArchivedEpcList: React.FC = () => {
	const { t } = useTranslation()
	const {
		selectedItems,
		searchTerm,
		advancedFilters,
		addItemToSet,
		removeItemFromSet,
		addAllItemsToSet,
		removeAllItemsFromSet
	} = useArchivedRestorationContext(
		'selectedItems',
		'addItemToSet',
		'addAllItemsToSet',
		'removeItemFromSet',
		'removeAllItemsFromSet',
		'searchTerm',
		'advancedFilters'
	)
	const { refetch: refetchArchivedEpcFeature } = useGetArchivedEpcFeatureQuery()
	const {
		data,
		hasNextPage,
		isFetchingNextPage,
		refetch: refetchArchivedEpc,
		fetchNextPage
	} = useGetArchivedEpcQuery({
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
			<ListContainer>
				<ListHeader>
					<Checkbox
						checked={(isAllItemsSelected || (isSomeItemsSelected && 'indeterminate')) as CheckedState}
						onCheckedChange={(checked) => {
							if (checked) addAllItemsToSet(data)
							else removeAllItemsFromSet()
						}}
					/>
					<Typography className='font-medium'>EPC</Typography>
					<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
						<GhostButton onClick={() => handleRefetch()}>
							<Icon name='RotateCw' />
						</GhostButton>
					</Tooltip>
				</ListHeader>
				{!Array.isArray(datalist) || datalist?.length === 0 ? (
					<Div className='flex h-[50vh] flex-col place-content-center items-center justify-center space-y-2'>
						<Icon name='PackageOpen' size={44} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
						<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
					</Div>
				) : (
					<ListBody ref={refCallback}>
						{before > 0 && <ListItem style={{ width: '100%', height: before }} />}
						{virtualItems.map((virtualItem) => {
							const item = datalist[virtualItem.index]
							const isSelected = selectedItems.some((epc) => epc.epc === item.epc)

							return (
								<ListItem
									key={virtualItem.key}
									data-index={virtualItem.index}
									aria-selected={isSelected}
									htmlFor={virtualItem.key.toString()}
									style={{
										height: virtualItem.size
									}}>
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
									<Typography>{item?.epc}</Typography>
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
								</ListItem>
							)
						})}
						{after > 0 && <ListItem style={{ width: '100%', height: after }} />}
						{hasNextPage && (
							<Typography variant='small' className='block text-center font-medium' color='muted'>
								{t('ns_common:status.loading')}
							</Typography>
						)}
					</ListBody>
				)}
			</ListContainer>
			<Typography variant='small' className='block text-end font-medium tracking-wide'>
				{t('ns_common:table.selected_rows', {
					selectedRows: `${selectedItems?.length}/${datalist?.length ?? 0}`,
					defaultValue: null
				})}
			</Typography>
		</Fragment>
	)
}

export default ArchivedEpcList
