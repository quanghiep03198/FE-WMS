import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import Pagination from '@components/customs/pagination'
import { buttonVariants } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet'
import { useSearchDefectiveGoods } from '@features/defective-goods/hooks/use-search-defective-goods'
import { type IDefectiveGoods } from '@features/defective-goods/types'
import useQueryParams from '@hooks/use-query-params'
import { useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash-es'
import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ListPanelProvider } from '../../../contexts/list-panel-context'
import {
	getDefectiveGoodsQueryOptions,
	useGetDefectiveGoodsQuery,
	usePrefetchDefectiveGoodsQuery
} from '../../../hooks/use-defective-goods-request'
import ActionButtonsGroup from './action-buttons-group'
import DataList from './data-list'
import DeleteConfirmDialog from './delete-confirm-dialog'
import ItemSelectionCheckbox from './item-selection-checkbox'
import SearchBox from './search-box'

const DatalistPanel: React.FC = () => {
	const { t } = useTranslation()
	const { data, isLoading, isPlaceholderData } = useGetDefectiveGoodsQuery()
	const queryClient = useQueryClient()
	const handlePrefetch = usePrefetchDefectiveGoodsQuery()
	const { searchParams: currentPage, setParam } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>, number>(
		undefined,
		{ select: (params) => params.page ?? 1 }
	)
	const [searchTerms] = useSearchDefectiveGoods()
	const visibleData = isPlaceholderData ? undefined : data
	const isMobileSelectionDisabled =
		isLoading || isPlaceholderData || !Array.isArray(visibleData?.data) || visibleData.data.length === 0
	const paginationProps = {
		...(omit(data, ['data']) as Omit<Pagination<unknown>, 'data'>),
		className: 'mx-auto w-full',
		page: currentPage,
		hasPrevPage: currentPage > 1,
		hasNextPage: currentPage < (data?.totalPages ?? 0),
		range: 1,
		onPageChange: (page: number) => setParam('page', page),
		onPrefetch: handlePrefetch
	}

	// Prefetch trang kế tiếp
	useEffect(() => {
		let cancelScheduledPrefetch: () => void = () => {
			console.info('Prefetch cancelled')
		}

		if (isPlaceholderData || !data || !data.hasNextPage) cancelScheduledPrefetch?.()

		const run = async () => {
			await queryClient.query(getDefectiveGoodsQueryOptions({ ...searchTerms, page: data.page + 1 }))
		}

		if (typeof window.requestIdleCallback === 'function') {
			const id = window.requestIdleCallback(() => void run(), { timeout: 120 })
			cancelScheduledPrefetch = () => window.cancelIdleCallback(id)
		} else {
			const id = setTimeout(() => void run(), 0)
			cancelScheduledPrefetch = () => clearTimeout(id)
		}

		return cancelScheduledPrefetch
	}, [data?.page, data?.hasNextPage, isPlaceholderData, queryClient, searchTerms])

	return (
		<Fragment>
			{/* Combination history list panel (Display on large screen).  Hidden by default, display when viewport >= 1440px */}
			<Div className='divide-border hidden h-full grid-rows-[var(--bar-height)_var(--bar-height)_auto_var(--bar-height)] items-stretch divide-y @7xl:grid'>
				<Div className='place-content-stretch place-items-center p-4'>
					<SearchBox />
				</Div>
				<ListPanelProvider>
					<Div className='flex w-full items-center justify-between px-4 py-2'>
						<ItemSelectionCheckbox
							data={visibleData?.data ?? []}
							disabled={isLoading || isPlaceholderData || data?.totalDocs === 0}
							limit={data?.limit ?? 0}
							totalDocs={data?.totalDocs ?? 0}
						/>
						<ActionButtonsGroup />
					</Div>
					<DataList data={visibleData} isLoading={isLoading || isPlaceholderData} />
				</ListPanelProvider>
				<Div className='place-content-center place-items-center'>
					<Pagination {...paginationProps} />
				</Div>
			</Div>
			{/* Combination history list panel sheet (Display on small screen). Display when viewport < 1440px */}
			<Sheet defaultOpen={false}>
				<SheetTrigger className='hidden' id='list-sheet-trigger' />
				<SheetContent className='group grid max-w-2xl grid-rows-[auto_auto_auto_auto] overflow-hidden'>
					<SheetHeader>
						<SheetTitle>{t('ns_inoutbound:titles.combination_history')}</SheetTitle>
					</SheetHeader>
					<Div className='overflow-clip rounded-md border px-2 py-1'>
						<SearchBox />
					</Div>
					<ListPanelProvider>
						<Div className='bg-table-head flex w-full items-center justify-between rounded-md px-3 py-2 shadow-sm'>
							<ItemSelectionCheckbox
								data={visibleData?.data ?? []}
								disabled={isMobileSelectionDisabled}
								limit={data?.limit ?? 0}
								totalDocs={data?.totalDocs ?? 0}
							/>
							<ActionButtonsGroup />
						</Div>
						<DataList data={visibleData} isLoading={isLoading || isPlaceholderData} />
					</ListPanelProvider>
					<SheetFooter>
						<Pagination {...paginationProps} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
			{/* Confirm delete on by ID */}
			<DeleteConfirmDialog />
		</Fragment>
	)
}

export const DataListPanelSheetTrigger: React.FC<React.ComponentProps<'label'>> = (props) => {
	const { t } = useTranslation()

	return (
		<label
			htmlFor='list-sheet-trigger'
			className={cn(
				buttonVariants({
					variant: 'secondary',
					size: 'sm',
					className: 'inline-flex @7xl/playground-wrapper:hidden'
				})
			)}
			{...props}>
			<Icon name='Clock' /> {t('ns_inoutbound:titles.combination_history')}
		</label>
	)
}

export default React.memo(DatalistPanel)
