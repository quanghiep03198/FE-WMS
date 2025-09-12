import useQueryParams from '@/common/hooks/use-query-params'
import { IDefectiveGoods } from '@/common/types/entities'
import {
	Button,
	Checkbox,
	Div,
	Icon,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
	Tooltip,
	Typography
} from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useQueryClient } from '@tanstack/react-query'
import { useSet } from 'ahooks'
import { omit, pickBy } from 'lodash'
import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsQueryKey, useGetDefectiveGoodsQuery } from '../../../-hooks/use-defective-goods-asm'
import DefectiveGoodInfoCard from './defective-goods-info-card'
import DeleteButton from './delete-button'
import EmptySection from './emtpy-section'
import SearchBox from './search-box'

const DefectiveGoodList: React.FC = () => {
	const { data, isLoading, refetch } = useGetDefectiveGoodsQuery()
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

	const handleToggleSelect = (checked: CheckedState) => {
		if (checked)
			data.data.forEach((item) => {
				add(item.id)
			})
		else reset()
	}

	return (
		<Fragment>
			<Div
				className='hidden h-full grid-rows-[var(--bar-height)_4rem_auto_var(--bar-height)] items-stretch divide-y divide-border @7xl:grid'
				style={
					{
						'--indent-space': '24px'
					} as React.CSSProperties
				}>
				<Div className='place-content-stretch place-items-center p-4'>
					<SearchBox />
				</Div>
				<Div className='flex w-full items-center justify-between bg-accent/25 px-4 py-2'>
					<Div className='inline-flex items-center gap-x-3'>
						<Checkbox
							className='ml-[calc(var(--indent-space)+1px)]'
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
					<Div className='ml-auto flex flex-1 items-center justify-end gap-x-1'>
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='ghost' onClick={() => refetch}>
								<Icon name='RotateCcw' />
							</Button>
						</Tooltip>
						{/* <Separator orientation='vertical' className='h-6 w-0.5' /> */}
						<DeleteButton
							disabled={selectedItems.size === 0}
							selectedItems={selectedItems}
							onAfterDelete={reset}
						/>
					</Div>
				</Div>
				{isLoading ? (
					<Div className='h-full flex-1 place-content-center place-items-center'>
						<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' size={18} />
					</Div>
				) : Array.isArray(data?.data) && data?.totalDocs > 0 ? (
					<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll py-4 pl-4 pr-2'>
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
				)}
				<Div className='place-content-center place-items-center'>
					<Pagination {...omit(data, ['data'])} onPrefetch={handlePrefetch} />
				</Div>
			</Div>
			<Sheet defaultOpen={false}>
				<SheetTrigger className='hidden' id='list-sheet-trigger' />
				<SheetContent className='max-w-2xl overflow-hidden'>
					<SheetHeader className='mt-4'>
						<SearchBox />
					</SheetHeader>
					{isLoading ? (
						<Div className='h-full flex-1 place-content-center place-items-center'>
							<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
						</Div>
					) : Array.isArray(data?.data) && data?.totalDocs > 0 ? (
						<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll pr-2'>
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
					)}
					<SheetFooter>
						<Pagination {...omit(data, ['data'])} onPrefetch={handlePrefetch} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</Fragment>
	)
}

export default DefectiveGoodList
