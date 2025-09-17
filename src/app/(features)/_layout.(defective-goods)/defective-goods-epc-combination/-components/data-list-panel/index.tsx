import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import {
	Button,
	Checkbox,
	Div,
	Icon,
	Separator,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Tooltip,
	Typography
} from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useSet } from 'ahooks'
import { AxiosError } from 'axios'
import { omit, pickBy } from 'lodash'
import React, { Fragment, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsQueryKey, useGetDefectiveGoodsQuery } from '../../../-hooks/use-defective-goods-asm'
import DefectiveGoodInfoCard from './defective-goods-info-card'
import DeleteButton from './delete-button'
import EmptySection from './emtpy-section'
import SearchBox from './search-box'

const DefectiveGoodList: React.FC = () => {
	const { data, isLoading } = useGetDefectiveGoodsQuery()
	const { searchParams } = useQueryParams<Pick<Pagination<IDefectiveGoods>, 'page'> & { q?: string }>()
	const [selectedItems, { add, remove, reset }] = useSet(new Set<number>())
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const handlePrefetch = useCallback((page) => {
		const params = pickBy({ ...searchParams, page }, (item) => !!item) as {
			page: number
			q?: string
		}
		queryClient.prefetchQuery({
			queryKey: [DefectiveGoodsQueryKey.DEFECTIVE_GOODS, params],
			queryFn: async () => await DefectiveGoodsService.getDefectiveGoods(params)
		})
	}, [])

	const handleSelect = useCallback((checked: boolean, id: number) => {
		if (!checked) remove(id)
		else add(id)
	}, [])

	const handleToggleSelect = useCallback((checked: CheckedState) => {
		if (checked)
			data.data.forEach((item) => {
				add(item.id)
			})
		else reset()
	}, [])

	return (
		<Fragment>
			<Div className='hidden h-full grid-rows-[var(--bar-height)_var(--bar-height)_auto_var(--bar-height)] items-stretch divide-y divide-border @7xl:grid'>
				<Div className='place-content-stretch place-items-center p-4'>
					<SearchBox />
				</Div>
				<Div className='flex w-full items-center justify-between px-4 py-2'>
					<RecordSelectionCheckbox
						data={data}
						selectedItems={selectedItems}
						handleToggleSelect={handleToggleSelect}
					/>
					<ActionsBar selectedItems={selectedItems} onReset={reset} />
				</Div>
				<DataList isLoading={isLoading} data={data} selectedItems={selectedItems} handleSelect={handleSelect} />
				<Div className='place-content-center place-items-center'>
					<Pagination {...omit(data, ['data'])} onPrefetch={handlePrefetch} />
				</Div>
			</Div>
			<Sheet defaultOpen={false}>
				<SheetTrigger className='hidden' id='list-sheet-trigger' />
				<SheetContent className='group max-w-2xl overflow-hidden'>
					<SheetHeader>
						<SheetTitle>{t('ns_inoutbound:titles.combination_history')}</SheetTitle>
					</SheetHeader>
					<Div className='h-10 overflow-hidden rounded-md border px-2 py-1'>
						<SearchBox />
					</Div>
					<Div className='flex w-full items-center justify-between rounded-md bg-table-head py-2 pl-6 pr-3 shadow-sm'>
						<RecordSelectionCheckbox
							data={data}
							selectedItems={selectedItems}
							handleToggleSelect={handleToggleSelect}
						/>
						<ActionsBar selectedItems={selectedItems} onReset={reset} />
					</Div>
					<DataList isLoading={isLoading} data={data} selectedItems={selectedItems} handleSelect={handleSelect} />
					<SheetFooter>
						<Pagination {...omit(data, ['data'])} onPrefetch={handlePrefetch} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</Fragment>
	)
}

const ActionsBar: React.FC<{ selectedItems: Set<number>; onReset: () => void }> = memo(({ selectedItems, onReset }) => {
	const { t } = useTranslation()
	const { refetch } = useGetDefectiveGoodsQuery()

	return (
		<Div className='ml-auto flex flex-1 items-center justify-end gap-x-1'>
			<Tooltip
				message={t('ns_common:actions.reload')}
				triggerProps={{
					asChild: true
				}}>
				<Button size='icon' variant='ghost' onClick={() => refetch()}>
					<Icon name='RotateCcw' />
				</Button>
			</Tooltip>
			<Separator orientation='vertical' className='h-4 w-0.5' />
			<DeleteButton disabled={selectedItems.size === 0} selectedItems={selectedItems} onAfterDelete={onReset} />
		</Div>
	)
})

ActionsBar.displayName = 'ActionsBar'

const DataList: React.FC<
	Pick<UseQueryResult<Pagination<IDefectiveGoods>, AxiosError<unknown, any>>, 'data' | 'isLoading'> & {
		selectedItems: Set<number>
		handleSelect: (checked: boolean, id: number) => void
	}
> = memo(({ isLoading, data, selectedItems, handleSelect }) => {
	return isLoading ? (
		<Div className='h-full flex-1 place-content-center place-items-center'>
			<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' size={18} />
		</Div>
	) : Array.isArray(data?.data) && data?.totalDocs > 0 ? (
		<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll py-4 pl-4 pr-2 group-data-[state=open]:p-0'>
			{data.data.map((item) => {
				return (
					<DefectiveGoodInfoCard
						key={item.id}
						data={item}
						selected={selectedItems.has(item.id)}
						onSelect={handleSelect}
					/>
				)
			})}
		</Div>
	) : (
		<EmptySection />
	)
})

DataList.displayName = 'DataList'

const RecordSelectionCheckbox: React.FC<{
	data: Pagination<IDefectiveGoods>
	handleToggleSelect: (checked: CheckedState) => void
	selectedItems: Set<number>
}> = memo(({ data, handleToggleSelect, selectedItems }) => {
	const { t } = useTranslation()

	return (
		<Div className='inline-flex items-center gap-x-3'>
			<Checkbox
				onCheckedChange={handleToggleSelect}
				checked={
					selectedItems.size === 0
						? false
						: selectedItems.size === data.limit || selectedItems.size === data.totalDocs
							? true
							: 'indeterminate'
				}
			/>
			<Typography variant='small' color='muted'>
				{t('ns_common:pagination.selected_records', {
					count: selectedItems.size,
					defaultValue: `${selectedItems.size} selected`
				})}
			</Typography>
		</Div>
	)
})

RecordSelectionCheckbox.displayName = 'RecordSelectionCheckbox'

export default DefectiveGoodList
