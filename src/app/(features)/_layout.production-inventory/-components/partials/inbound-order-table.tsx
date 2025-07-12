import { IInboundInventory } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, TableCell, TableFooter, TableRow, Tooltip } from '@/components/ui'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzyFilter } from '@/components/ui/@react-table/utils'
import { ColumnDef, createColumnHelper, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RFIDDataType } from '../../../_layout.(rfid)/-constants'
import DataTable from '../data-table'

type InboundOrderTableProps = {
	data: Array<IInboundInventory>
}

const InboundOrderTable: React.FC<InboundOrderTableProps> = ({ data }) => {
	const { t, i18n } = useTranslation()

	const columnHelper = createColumnHelper<IInboundInventory>()

	const columns = useMemo<ColumnDef<IInboundInventory, any>[]>(() => {
		return [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				size: 50,
				enableSorting: false,
				enableColumnFilter: false,
				meta: { align: 'center' },
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
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				cell: (info) => info.getValue(),
				size: 120,
				maxSize: 120,
				enableSorting: true,
				enableColumnFilter: true,
				filterFn: fuzzyFilter
			}),
			columnHelper.accessor('last_inbound_time', {
				header: t('ns_erp:fields.last_inbound_time'),
				cell: (info) => {
					const value = info.getValue()
					return value ? (
						format(value, 'yyyy-MM-dd')
					) : (
						<Div className='place-items-center'>
							<Icon name='CalendarOff' className='stroke-muted-foreground' />
						</Div>
					)
				},
				size: 180,
				enableSorting: true,
				enableGlobalFilter: false
			}),
			columnHelper.accessor('mo_qty', {
				header: t('ns_erp:fields.mo_qty'),
				enableSorting: true,
				enableGlobalFilter: false,
				cell: (info) => formatIntlNumber(info.getValue()),
				meta: {
					align: 'right'
				}
			}),
			columnHelper.accessor('inbound_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				cell: (info) => formatIntlNumber(info.getValue()),
				enableSorting: true,
				enableGlobalFilter: false,
				meta: {
					align: 'right',
					filterVariant: 'range'
				}
			}),

			columnHelper.accessor('inspected_qty', {
				header: t('ns_erp:fields.inspected_qty'),
				cell: (info) => formatIntlNumber(info.getValue()),
				size: 180,
				enableSorting: true,
				enableGlobalFilter: false,
				meta: {
					align: 'right',
					filterVariant: 'range'
				}
			})
		]
	}, [i18n.language])

	return (
		<DataTable
			data={data}
			dataType={RFIDDataType.INBOUND}
			columns={columns}
			caption={t('ns_inoutbound:description.inbound_directive')}
			footer={DataTableFooter}
		/>
	)
}

const DataTableFooter = memo(({ rows }: { rows: Row<IInboundInventory>[] }) => {
	const { t } = useTranslation()
	return (
		<TableFooter className='sticky bottom-0 z-20'>
			<TableRow className='bg-table-head [&_td:not(first-child)]:bg-table-head [&_td]:h-10 [&_td]:border-x-0 [&_td]:border-t'>
				<TableCell colSpan={3} align='left' className='sticky left-0 z-10 !bg-transparent font-semibold'>
					{t('ns_common:common_fields.total')}
				</TableCell>
				<TableCell align='right' className='font-semibold'>
					{formatIntlNumber(rows?.reduce((total, item) => total + item.original.mo_qty, 0) ?? 0)}
				</TableCell>
				<TableCell align='right' className='font-semibold'>
					{formatIntlNumber(rows?.reduce((total, item) => total + item.original.inbound_qty, 0) ?? 0)}
				</TableCell>
				<TableCell align='right' className='font-semibold'>
					{formatIntlNumber(rows?.reduce((total, item) => total + item.original.inspected_qty, 0) ?? 0)}
				</TableCell>
			</TableRow>
		</TableFooter>
	)
})

DataTableFooter.displayName = 'InboundOrderTableFooter'

export default InboundOrderTable
