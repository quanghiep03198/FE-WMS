import type { IOutboundReport } from '@common/types/entities'
import formatIntlNumber from '@common/utils/format-intl-number'
import { NestedCell, NestedColumn } from '@components/shared/horizontal-nested-table'
import { Div, TableCell, TableRow } from '@components/ui'
import { sortBy } from 'lodash-es'
import { useMemo } from 'react'

export const ReportDetailRow: React.FC<{ data: IOutboundReport['detail'][number] }> = ({ data }) => {
	const aggregateSizeCount = useMemo(
		() =>
			Array.isArray(data?.sizes)
				? data.sizes.reduce((acc, curr) => {
						return acc + curr.qty
					}, 0)
				: 0,
		[data]
	)

	return (
		<TableRow className='[&>td]:border-b!'>
			<TableCell className='group/cell sticky left-0 z-10 w-(--sticky-left-col-width) min-w-(--sticky-left-col-width) space-y-1 text-center shadow-[1px_0px_0px_var(--border)]'>
				<Div className='flex items-center gap-x-2'>{data?.mo_no}</Div>
			</TableCell>
			<TableCell className='p-0!'>
				<Div className='flex grow border-collapse flex-nowrap divide-x' onContextMenu={(e) => e.preventDefault()}>
					{Array.isArray(data?.sizes) &&
						sortBy(data.sizes, 'size_numcode').map((size) => (
							<NestedColumn key={size?.size_numcode}>
								<NestedCell className='bg-table-head group-hover:bg-table-row-active aria-selected:bg-table-row-selected data-[disabled=true]:bg-muted px-4 py-2 font-medium first:border-l-0 last:border-r-0 has-[[role=button]]:text-center has-[[role=checkbox]]:text-center has-[[role=combobox]]:p-0 has-[[role=listbox]]:p-0 has-[[role=textbox]]:p-0 data-[type=number]:text-right'>
									{size?.size_numcode}
								</NestedCell>
								<NestedCell>{formatIntlNumber(size?.qty ?? 0)}</NestedCell>
							</NestedColumn>
						))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-0 w-24 min-w-24 font-medium'>
				{formatIntlNumber(aggregateSizeCount)}
			</TableCell>
		</TableRow>
	)
}
