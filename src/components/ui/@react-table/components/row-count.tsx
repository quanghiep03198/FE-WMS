import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'
import { useTableContext } from '../context/table.context'

type DataTableRowCountProps = {
	enableRowSelection: boolean | ((row: Row<any>) => boolean)
	manualPagination: boolean
	manualTotalDocs: number
}

const TableRowCount: React.FC<DataTableRowCountProps> = ({ enableRowSelection, manualPagination, manualTotalDocs }) => {
	const { t } = useTranslation()
	const { table } = useTableContext('table')

	const selectedRows = table.getFilteredSelectedRowModel()?.rows?.length
	const totalRows = manualPagination ? manualTotalDocs : (table.getFilteredRowModel()?.rows?.length ?? 0)
	const rowSelectionCount = String(selectedRows) + '/' + String(totalRows)

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
