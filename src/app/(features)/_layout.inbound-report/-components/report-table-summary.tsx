'use no memo'

import type { IInboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Separator, Typography } from '@/components/ui'
import type { Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ReportTableSummary: React.FC<{ table: Table<IInboundReport>; data: IInboundReport[] }> = ({ table, data }) => {
	const { t } = useTranslation()

	return (
		<Div role='row' className='flex h-10 w-full items-center justify-center gap-x-4 px-4 py-2'>
			<Typography color='muted' className='font-medium'>
				{t('ns_common:common_fields.total')}
			</Typography>
			<Separator orientation='horizontal' className='h-0.5 basis-4' />
			<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
				{Array.isArray(table.getFilteredRowModel().flatRows)
					? formatIntlNumber(
							table
								.getFilteredRowModel()
								.flatRows.reduce((acc, curr) => acc + curr.original.daily_inbound_qty, 0)
						)
					: 0}
				<Typography as='small' variant='small'>
					prs
				</Typography>
			</Typography>
		</Div>
	)
}

export default ReportTableSummary
