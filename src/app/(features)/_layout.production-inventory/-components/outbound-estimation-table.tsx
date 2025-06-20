import { IOutboundEstimation } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Icon, TableCell, TableFooter, TableRow, Tooltip } from '@/components/ui'

import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from './data-table'

type OutboundEstimationTableProps = {
	data: IOutboundEstimation[]
}

export const OutboundEstimationTable: React.FC<OutboundEstimationTableProps> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IOutboundEstimation>()

	const columns = useMemo<ColumnDef<IOutboundEstimation, any>[]>(() => {
		return [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				size: 50,
				enableSorting: false,
				enableColumnFilter: false,
				header: ({ table }) => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				cell: ({ row, table }) => (
					<button
						className='absolute inset-0 flex h-full w-full items-center justify-center'
						onClick={() => {
							table.toggleAllRowsExpanded(false)
							row.toggleExpanded(!row.getIsExpanded())
						}}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</button>
				)
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				cell: (info) => info.getValue(),
				size: 150,
				maxSize: 150,
				enableSorting: true,
				enableColumnFilter: true
			}),

			columnHelper.accessor('outbound_date', {
				header: t('ns_erp:fields.outbound_date'),
				cell: (info) => format(info.getValue(), 'yyyy-MM-dd'),
				enableSorting: true,
				enableGlobalFilter: false,
				meta: {
					align: 'right',
					filterVariant: 'range'
				}
			}),
			columnHelper.accessor('po_qty', {
				header: t('ns_erp:fields.order_qty'),
				cell: (info) => formatIntlNumber(info.getValue()),
				size: 180,
				enableSorting: true,
				enableGlobalFilter: false,
				meta: {
					align: 'right',
					filterVariant: 'range'
				}
			}),
			columnHelper.accessor('outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableSorting: true,
				enableGlobalFilter: false,
				cell: (info) => formatIntlNumber(info.getValue()),
				meta: {
					align: 'right'
				}
			})
		]
	}, [i18n.language])

	const flexRenderFooter = useCallback(({ rows }: { rows: Row<IOutboundEstimation>[] }) => {
		return (
			<TableFooter className='sticky bottom-0 z-20'>
				<TableRow className='[&_td]:h-10 [&_td]:border-x-0 [&_td]:border-t [&_td]:bg-table-head'>
					<TableCell colSpan={3} align='left' className='sticky left-0 z-10 font-semibold'>
						{t('ns_common:common_fields.total')}
					</TableCell>
					<TableCell align='right' className='font-semibold'>
						{formatIntlNumber(rows?.reduce((acc, curr) => acc + curr.original.po_qty, 0) ?? 0)}
					</TableCell>
					<TableCell align='right' className='font-semibold'>
						{formatIntlNumber(rows?.reduce((acc, curr) => acc + curr.original.outbound_qty, 0) ?? 0)}
					</TableCell>
				</TableRow>
			</TableFooter>
		)
	}, [])

	return (
		<DataTable
			data={data}
			dataType='outbound'
			columns={columns}
			caption={t('ns_inoutbound:description.outbound_estimation')}
			footer={flexRenderFooter}
		/>
	)
}
