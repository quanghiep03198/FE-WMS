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
import { CheckedState } from '@radix-ui/react-checkbox'
import { UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { omit, pick } from 'lodash'
import React, { Fragment, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ListPanelProvider, useListPanelContext } from '../../-contexts/list-panel-context'
import { useGetDefectiveGoodsQuery, usePrefetchDefectiveGoodsQuery } from '../../../-hooks/use-defective-goods-asm'
import DefectiveGoodsInfoCard from './defective-goods-info-card'
import DeleteButton from './delete-button'
import EmptySection from './emtpy-section'
import SearchBox from './search-box'

const DefectiveGoodList: React.FC = () => {
	const { t } = useTranslation()
	const { data, isLoading } = useGetDefectiveGoodsQuery()
	const handlePrefetch = usePrefetchDefectiveGoodsQuery()

	return (
		<Fragment>
			{/* Combination history list panel (Display on large screen) */}
			{/* Hidden by default, display when viewport >= 1440px */}
			<Div className='hidden h-full grid-rows-[var(--bar-height)_var(--bar-height)_auto_var(--bar-height)] items-stretch divide-y divide-border @7xl:grid'>
				<Div className='place-content-stretch place-items-center p-4'>
					<SearchBox />
				</Div>
				<ListPanelProvider>
					<Div className='flex w-full items-center justify-between px-4 py-2'>
						<RecordSelectionCheckbox {...pick(data, ['data', 'totalDocs', 'limit'])} />
						<ActionButtonsGroup />
					</Div>
					<DataList isLoading={isLoading} data={data} />
				</ListPanelProvider>
				<Div className='place-content-center place-items-center'>
					<Pagination {...omit(data, ['data'])} range={1} onPrefetch={handlePrefetch} />
				</Div>
			</Div>
			{/* Combination history list panel sheet (Display on small screen) */}
			{/* Display when viewport < 1440px */}
			<Sheet defaultOpen={false}>
				<SheetTrigger className='hidden' id='list-sheet-trigger' />
				<SheetContent className='group max-w-2xl overflow-hidden'>
					<SheetHeader>
						<SheetTitle>{t('ns_inoutbound:titles.combination_history')}</SheetTitle>
					</SheetHeader>
					<Div className='h-10 overflow-hidden rounded-md border px-2 py-1'>
						<SearchBox />
					</Div>
					<ListPanelProvider>
						<Div className='flex w-full items-center justify-between rounded-md bg-table-head py-2 pl-6 pr-3 shadow-sm'>
							<RecordSelectionCheckbox {...pick(data, ['data', 'totalDocs', 'limit'])} />
							<ActionButtonsGroup />
						</Div>
						<DataList isLoading={isLoading} data={data} />
					</ListPanelProvider>
					<SheetFooter>
						<Pagination {...omit(data, ['data'])} range={1} onPrefetch={handlePrefetch} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</Fragment>
	)
}

const ActionButtonsGroup: React.FC = () => {
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
			<DeleteButton />
		</Div>
	)
}

ActionButtonsGroup.displayName = 'ActionsBar'

const DataList: React.FC<
	Pick<UseQueryResult<Pagination<IDefectiveGoods>, AxiosError<unknown, any>>, 'data' | 'isLoading'>
> = ({ isLoading, data }) => {
	return isLoading ? (
		<Div className='h-full flex-1 place-content-center place-items-center'>
			<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' size={18} />
		</Div>
	) : Array.isArray(data?.data) && data?.totalDocs > 0 ? (
		<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-y-4 !overflow-y-scroll py-4 pl-4 pr-2 group-data-[state=open]:p-0'>
			{data.data.map((item) => {
				return <DefectiveGoodsInfoCard key={item.id} data={item} />
			})}
		</Div>
	) : (
		<EmptySection />
	)
}

DataList.displayName = 'DataList'

const RecordSelectionCheckbox: React.FC<Pick<Pagination<IDefectiveGoods>, 'data' | 'totalDocs' | 'limit'>> = ({
	data,
	totalDocs
}) => {
	const { t } = useTranslation()
	const { updatePageItems, getSelectedCount, getCheckboxState, toggleAll, clearSelection } = useListPanelContext()

	// Update page items when data changes
	useEffect(() => {
		if (data?.length) {
			const pageItemIds = data.map((item) => item.id)
			updatePageItems(pageItemIds, totalDocs)
		}
	}, [data, totalDocs, updatePageItems])

	// Get current checkbox state and selected count
	const checkboxState = getCheckboxState()
	const selectedCount = getSelectedCount()

	// Handle checkbox change
	const handleCheckboxChange = useCallback(
		(checked: CheckedState) => {
			if (checked === true) {
				toggleAll()
			} else if (checked === false) {
				clearSelection()
			}
			// Indeterminate state is computed, no action needed
		},
		[toggleAll, clearSelection]
	)

	return (
		<Div className='inline-flex items-center gap-x-3'>
			<Checkbox checked={checkboxState} onCheckedChange={handleCheckboxChange} />

			<Typography variant='small' color='muted'>
				{t('ns_common:pagination.selected_records', {
					count: selectedCount,
					defaultValue: `${selectedCount} selected`
				})}
			</Typography>
		</Div>
	)
}

RecordSelectionCheckbox.displayName = 'RecordSelectionCheckbox'

export default DefectiveGoodList
