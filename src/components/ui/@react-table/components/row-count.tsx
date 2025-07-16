import { Row } from '@tanstack/react-table'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'
import { useTableContext } from '../context/table.context'

export type DataTableRowCountProps = {
	enableRowSelection: boolean | ((row: Row<any>) => boolean)
	manualPagination: boolean
	manualTotalDocs: number
}

const TableRowCount: React.FC<DataTableRowCountProps> = ({ enableRowSelection, manualPagination, manualTotalDocs }) => {
	'use no memo'

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

const MemoizedTableRowCount = memo(TableRowCount) as typeof TableRowCount

export { MemoizedTableRowCount, TableRowCount }

/**
 {isResizingColumn ? (
					<MemoizedTablePaginateControl
						{...({
							tablePaginationProps: { loading, manualPagination, paginationProps, onPaginationChange },
							tableRowCountProps: {
								enableRowSelection,
								manualPagination,
								manualTotalDocs: paginationProps?.totalDocs ?? 0
							}
						} as unknown as TableControllerProps<TData>)}
					/>
				) : (
					<TablePaginateControl
						{...({
							tablePaginationProps: { loading, manualPagination, paginationProps, onPaginationChange },
							tableRowCountProps: {
								enableRowSelection,
								manualPagination,
								manualTotalDocs: paginationProps?.totalDocs ?? 0
							}
						} as unknown as TableControllerProps<TData>)}
					/>
				)}
 */
