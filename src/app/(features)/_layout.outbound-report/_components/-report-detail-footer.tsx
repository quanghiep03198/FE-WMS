import { IOutboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, TableCell, TableFooter, TableRow } from '@/components/ui'
import { sortBy } from 'lodash'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NestedCell, NestedRow } from '../../_components/_shared/-horizontal-nested-table'

const ReportDetailFooter: React.FC<{ data: IOutboundReport['detail'] }> = ({ data }) => {
	const { t } = useTranslation()

	const aggregatedSizeCount = useMemo<Array<{ size_numcode: string; qty: number }>>(() => {
		if (!Array.isArray(data)) return []
		return data
			.flatMap((item) => item.sizes)
			.reduce((acc, curr) => {
				const existing = acc.find((size) => size.size_numcode === curr.size_numcode)
				if (existing) {
					existing.qty += curr.qty
				} else {
					acc.push({ ...curr })
				}
				return acc
			}, [])
	}, [data])

	const totalSizeCount = useMemo(() => {
		if (!Array.isArray(aggregatedSizeCount)) return 0
		return aggregatedSizeCount.reduce((acc, curr) => acc + curr.qty, 0)
	}, [])

	return (
		<TableFooter>
			<TableRow>
				<TableCell className='font-medium text-table-head-foreground'>
					{t('ns_erp:fields.total_qty_by_size')}
				</TableCell>
				<TableCell className='!p-0'>
					<Div
						className='flex flex-grow border-collapse flex-nowrap divide-x'
						onContextMenu={(e) => e.preventDefault()}>
						{Array(aggregatedSizeCount) &&
							sortBy(aggregatedSizeCount, 'size_numcode').map((size) => (
								<NestedRow key={size?.size_numcode} className=''>
									<NestedCell className='bg-table-head px-4 py-2 font-medium first:border-l-0 last:border-r-0 group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted data-[type=number]:text-right [&:has([role=button])]:text-center [&:has([role=checkbox])]:text-center [&:has([role=combobox])]:p-0 [&:has([role=listbox])]:p-0 [&:has([role=textbox])]:p-0'>
										{size?.size_numcode}
									</NestedCell>
									<NestedCell>{formatIntlNumber(size?.qty ?? 0)}</NestedCell>
								</NestedRow>
							))}
					</Div>
				</TableCell>
				<TableCell className='font-medium' align='right'>
					{formatIntlNumber(totalSizeCount)}
				</TableCell>
			</TableRow>
		</TableFooter>
	)
}

export default ReportDetailFooter
