import { Div, Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { omit, pick } from 'lodash'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ListPanelProvider } from '../../-contexts/list-panel-context'
import { useGetDefectiveGoodsQuery, usePrefetchDefectiveGoodsQuery } from '../../../-hooks/use-defective-goods-asm'
import ActionButtonsGroup from './action-buttons-group'
import DataList from './data-list'
import ItemSelectionCheckbox from './item-selection-checkbox'
import SearchBox from './search-box'

const DatalistPanel: React.FC = () => {
	const { t } = useTranslation()
	const { data, isLoading } = useGetDefectiveGoodsQuery()
	const handlePrefetch = usePrefetchDefectiveGoodsQuery()

	return (
		<Fragment>
			{/* Combination history list panel (Display on large screen).  Hidden by default, display when viewport >= 1440px */}
			<Div className='hidden h-full grid-rows-[var(--bar-height)_var(--bar-height)_auto_var(--bar-height)] items-stretch divide-y divide-border @7xl:grid'>
				<Div className='place-content-stretch place-items-center p-4'>
					<SearchBox />
				</Div>
				<ListPanelProvider>
					<Div className='flex w-full items-center justify-between px-4 py-2'>
						<ItemSelectionCheckbox
							{...pick(data, ['data', 'totalDocs', 'limit'])}
							disabled={isLoading || data.totalDocs === 0}
						/>
						<ActionButtonsGroup />
					</Div>
					<DataList isLoading={isLoading} data={data} />
				</ListPanelProvider>
				<Div className='place-content-center place-items-center'>
					<Pagination {...omit(data, ['data'])} range={1} onPrefetch={handlePrefetch} />
				</Div>
			</Div>
			{/* Combination history list panel sheet (Display on small screen). Display when viewport < 1440px */}
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
							<ItemSelectionCheckbox
								{...pick(data, ['data', 'totalDocs', 'limit'])}
								disabled={isLoading || !Array.isArray(data.data) || data.data.length === 0}
							/>
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

export default DatalistPanel
