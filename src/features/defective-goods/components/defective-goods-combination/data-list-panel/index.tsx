import { cn } from '@common/utils/cn'
import type { Label } from '@components/ui'
import {
	buttonVariants,
	Div,
	Icon,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@components/ui'
import Pagination from '@components/ui/@custom/pagination'
import useQueryParams from '@hooks/use-query-params'
import { omit } from 'lodash-es'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ListPanelProvider } from '../../../contexts/list-panel-context'
import { useGetDefectiveGoodsQuery, usePrefetchDefectiveGoodsQuery } from '../../../hooks/use-defective-goods-request'
import ActionButtonsGroup from './action-buttons-group'
import DataList from './data-list'
import DeleteConfirmDialog from './delete-confirm-dialog'
import ItemSelectionCheckbox from './item-selection-checkbox'
import SearchBox from './search-box'

const DatalistPanel: React.FC = () => {
	const { t } = useTranslation()
	const { data, isLoading } = useGetDefectiveGoodsQuery()
	const handlePrefetch = usePrefetchDefectiveGoodsQuery()
	const { setParams } = useQueryParams<{ page: number }>()

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
						{...omit(data, ['data'])}
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
							{...omit(data, ['data'])}
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

export const DataListPanelSheetTrigger: React.FC<React.ComponentProps<typeof Label>> = (props) => {
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
