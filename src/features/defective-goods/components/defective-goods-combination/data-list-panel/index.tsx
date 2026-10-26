import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import Pagination from '@components/customs/pagination'
import { buttonVariants } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@components/ui/sheet'
import { PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY } from '@features/defective-goods/constants/storage-keys'
import { type DefectiveGoodQueryParams } from '@features/defective-goods/schemas/defective-goods.schema'
import { type IDefectiveGoods } from '@features/defective-goods/types'
import useQueryParams from '@hooks/use-query-params'
import { useQueryClient } from '@tanstack/react-query'
import { useSessionStorageState } from 'ahooks'
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
	const { searchParams, setParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'>>({ page: 1 })
	const [searchTerms] = useSessionStorageState<DefectiveGoodQueryParams>(PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY, {
		listenStorageChange: true
	})

	// Prefetch trang kế tiếp
	useEffect(() => {
		if (!isPlaceholderData || !data || !data.hasNextPage) return

		const run = async () =>
			await queryClient.query(
				getDefectiveGoodsQueryOptions({ ...searchParams, ...searchTerms, page: data.page + 1 })
			)

		const id = 'requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 120 }) : setTimeout(run, 0)

		return () => {
			if ('cancelIdleCallback' in window) cancelIdleCallback(id as number)
			else clearTimeout(id as number)
		}
	}, [data?.page, isPlaceholderData, data?.hasNextPage])

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
							data={data?.data ?? []}
							disabled={isLoading || data?.totalDocs === 0}
							limit={data?.limit ?? 0}
							totalDocs={data?.totalDocs ?? 0}
						/>
						<ActionButtonsGroup />
					</Div>
					<DataList data={data} isLoading={isLoading} />
				</ListPanelProvider>
				<Div className='place-content-center place-items-center'>
					<Pagination
						{...(omit(data, ['data']) as Omit<Pagination<unknown>, 'data'>)}
						className='mx-auto w-full'
						range={1}
						onPageChange={(page) => setParams({ page })}
						onPrefetch={handlePrefetch}
					/>
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
								data={data?.data ?? []}
								disabled={isLoading || !Array.isArray(data?.data) || data.data.length === 0}
								limit={data?.limit ?? 0}
								totalDocs={data?.totalDocs ?? 0}
							/>
							<ActionButtonsGroup />
						</Div>
						<DataList data={data} isLoading={isLoading} />
					</ListPanelProvider>
					<SheetFooter>
						<Pagination
							{...(omit(data, ['data']) as Omit<Pagination<unknown>, 'data'>)}
							className='mx-auto w-full'
							range={1}
							onPageChange={(page) => setParams({ page })}
							onPrefetch={handlePrefetch}
						/>
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

export default DatalistPanel
