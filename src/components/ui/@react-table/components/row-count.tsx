import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'

type DataTableRowCountProps = {
	enableRowSelection: boolean | ((row: Row<any>) => boolean)
	rowSelectionCount: string
	totalRows: number
}

const TableRowCount: React.FC<DataTableRowCountProps> = ({ enableRowSelection, rowSelectionCount, totalRows }) => {
	const { t } = useTranslation()

	// Display row count based on whether row selection is enabled

	return enableRowSelection ? (
		<Typography className='text-sm font-medium sm:hidden'>
			{t('ns_common:table.selected_rows', {
				selectedRows: rowSelectionCount,
				defaultValue: null
			})}
		</Typography>
	) : (
		<Typography className='text-sm font-medium sm:hidden'>
			{t('ns_common:table.total_rows', {
				count: totalRows,
				defaultValue: `${totalRows} rows`
			})}
		</Typography>
	)
}

export default TableRowCount
