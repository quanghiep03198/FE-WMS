import { Button, Div, Icon, Separator, Typography } from '@/components/ui'
import formatIntlNumber from '@common/utils/format-intl-number'
import { useGetCanInoutboundEpcQuery } from '@features/defective-goods/hooks/use-defective-goods-request'
import { useFilterQuery } from '@features/defective-goods/hooks/use-filter-query'
import { omit } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InoutboundStrategySelect from '../inoutbound-controller/inoutbound-strategy-select'

type TableFooterProps = {
	onResetColumnFilter: () => void
}

const DataTableFooter: React.FC<TableFooterProps> = ({ onResetColumnFilter }) => {
	const { t } = useTranslation()
	const { data, isLoading, refetch } = useGetCanInoutboundEpcQuery()
	const { searchParams, removeParam } = useFilterQuery()

	const handleClearFilters = () => {
		for (const key in searchParams) {
			if (key === 'action') continue
			removeParam(key)
		}
		onResetColumnFilter()
	}

	return (
		<Div
			role='row'
			className='sticky bottom-0 z-50 mt-auto flex h-[var(--row-height)] items-center justify-between gap-x-1 bg-background px-4 py-2 @4xl:gap-x-2'>
			<Div className='@6xl:hidden'>
				<InoutboundStrategySelect />
			</Div>
			<Separator className='mx-2 h-6 w-0.5 @6xl:hidden' />
			<Button variant='outline' disabled={isLoading} onClick={() => refetch()}>
				{isLoading ? (
					<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
				) : (
					<Icon name='RefreshCcw' />
				)}
				{t('ns_common:actions.reload')}
			</Button>
			<Button
				variant='destructive'
				disabled={Object.keys(omit(searchParams, ['action'])).length === 0}
				onClick={handleClearFilters}>
				<Icon name='FunnelX' /> {t('ns_common:actions.clear_filter')}
			</Button>
			<Typography role='cell' className='ml-auto text-right font-medium'>
				{`${t('ns_common:common_fields.total')}: ${Array.isArray(data) ? formatIntlNumber(data.length) : 0}`}
			</Typography>
		</Div>
	)
}

export default DataTableFooter
