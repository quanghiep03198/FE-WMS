import { IOutboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, TableCell, TableFooter, TableRow } from '@/components/ui'
import { capitalize, sortBy } from 'lodash'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NestedCell, NestedRow } from '../../_components/_shared/-horizontal-nested-table'

const ReportDetailFooter: React.FC<{ data: IOutboundReport['overall'] }> = ({ data }) => {
	const { t } = useTranslation()

	const totalAccumulatedQty = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.reduce((acc, curr) => acc + curr.daily_qty, 0)
	}, [data])
	const totalMissingQty = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.reduce((acc, curr) => acc + curr.missing_qty, 0)
	}, [data])

	return (
		<TableFooter>
			<TableRow>
				<TableCell colSpan={3} align='center' className='bg-muted text-muted-foreground'>
					{t('ns_common:titles.overall')}
				</TableCell>
			</TableRow>
			<TableRow className='sticky bottom-0 z-10 *:shadow-[1px_-1px_0px_hsl(var(--border))]'>
				<TableCell
					align='left'
					className='group/cell sticky left-0 z-10 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] space-y-1 !p-0 text-left text-table-head-foreground'>
					<NestedRow className='w-full !grid-rows-4 [&>*]:lowercase [&>*]:first-letter:uppercase'>
						<NestedCell>Size</NestedCell>
						<NestedCell>{t('ns_erp:fields.order_qty')}</NestedCell>
						<NestedCell>{t('ns_erp:fields.daily_productivity')}</NestedCell>
						<NestedCell>{t('ns_erp:fields.actual_missing_qty')}</NestedCell>
					</NestedRow>
				</TableCell>
				<TableCell className='!p-0'>
					<Div
						className='flex flex-grow border-collapse flex-nowrap divide-x'
						onContextMenu={(e) => e.preventDefault()}>
						{Array(data) &&
							sortBy(data, 'size_numcode').map((size) => (
								<NestedRow key={size?.size_numcode} className='!grid-rows-3'>
									<NestedCell className='px-4 py-2 font-medium text-table-head-foreground first:border-l-0 last:border-r-0 group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted data-[type=number]:text-right [&:has([role=button])]:text-center [&:has([role=checkbox])]:text-center [&:has([role=combobox])]:p-0 [&:has([role=listbox])]:p-0 [&:has([role=textbox])]:p-0'>
										{size?.size_numcode}
									</NestedCell>
									<NestedCell className='font-normal'>{formatIntlNumber(size?.po_size_qty ?? 0)}</NestedCell>
									<NestedCell className='font-normal'>{formatIntlNumber(size?.daily_qty ?? 0)}</NestedCell>
									<NestedCell className='font-normal'>{formatIntlNumber(size?.missing_qty ?? 0)}</NestedCell>
								</NestedRow>
							))}
					</Div>
				</TableCell>
				<TableCell className='sticky right-0 w-24 min-w-24 !p-0 font-medium' align='right'>
					<NestedRow className='w-full !grid-rows-4'>
						<NestedCell className='row-span-2 flex h-full items-center justify-end text-table-head-foreground'>
							{capitalize(t('ns_common:common_fields.total'))}
						</NestedCell>
						<NestedCell>{formatIntlNumber(totalAccumulatedQty)}</NestedCell>
						<NestedCell>{formatIntlNumber(totalMissingQty)}</NestedCell>
					</NestedRow>
				</TableCell>
			</TableRow>
		</TableFooter>
	)
}

export default ReportDetailFooter
