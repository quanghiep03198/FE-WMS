import { IProductionImportOrder } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip } from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RowSelectionType } from '@/components/ui/@react-table/types'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { useLatest, useResetState } from 'ahooks'
import { format, isValid } from 'date-fns'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetProductionImportListQuery } from '../_apis/use-warehouse-import.api'

const ProductionImportList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useGetProductionImportListQuery()
	const tableInstanceRef = useLatest<Table<IProductionImportOrder>>(null)
	const [rowSelectionType, setRowSelectionType] = useResetState<RowSelectionType>(undefined)
	const columnHelper = createColumnHelper()

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								setRowSelectionType('multiple')
								table.toggleAllPageRowsSelected(!!checkedState)
							}}
						/>
					)
				},
				cell: ({ row }) => (
					<Checkbox
						aria-label='Select row'
						role='checkbox'
						checked={row.getIsSelected()}
						onCheckedChange={(checkedState) => {
							if (checkedState) setRowSelectionType('multiple')
							row.toggleSelected(Boolean(checkedState))
						}}
					/>
				),
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.accessor('sno_no', {
				id: 'sno_no',
				header: t('ns_erp:fields.sno_no'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('status_approve', {
				id: 'status_approve',
				header: t('ns_erp:fields.status_approve'),
				cell: ({ row }) => (
					<Checkbox
						aria-label='Select row'
						role='checkbox'
						checked={row.getIsSelected()}
						onCheckedChange={(checkedState) => {
							if (checkedState) setRowSelectionType('multiple')
							row.toggleSelected(Boolean(checkedState))
						}}
					/>
				),
				size: 96,
				enableSorting: false,
				enableHiding: false,
				enableResizing: true,
				enablePinning: false
			}),
			columnHelper.accessor('active_date', {
				id: 'active_date',
				header: t('ns_erp:fields.sno_date'),
				cell: ({ getValue }) => format(getValue() as Date, 'yyyy/MM/dd'),
				meta: { filterVariant: 'date' },
				filterFn: 'inDateRange',
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('shaping_dept_code', {
				id: 'shaping_dept_code',
				header: t('ns_erp:fields.shaping_dept_code'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('shaping_dept_name', {
				id: 'shaping_dept_name',
				header: t('ns_erp:fields.shaping_dept_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('sno_location', {
				id: 'sno_location',
				header: t('ns_warehouse:fields.storage_num'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('user_name_updated', {
				id: 'user_name_updated',
				header: t('ns_common:common_fields.user_name_updated'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('updated', {
				id: 'updated',
				header: t('ns_common:common_fields.updated_at'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort,
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value || isValid(value)) return '-'
					return format(value as Date, 'yyyy-MM-dd')
				}
			}),
			columnHelper.accessor('remark', {
				id: 'remark',
				header: t('ns_common:common_fields.remark'),
				enableSorting: false,
				enableColumnFilter: false,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				enableSorting: false,
				enableColumnFilter: false,
				enableResizing: false,
				size: 80
			})
		],
		[i18n.language]
	)

	return (
		<DataTable
			data={data}
			loading={isLoading}
			columns={columns}
			ref={tableInstanceRef}
			enableRowSelection={true}
			containerProps={{ className: 'h-[50vh] xxl:h-[60vh]' }}
			toolbarProps={{
				slotRight: ({ table }) => (
					<Fragment>
						{table.getIsSomeRowsSelected() && rowSelectionType == 'multiple' && (
							<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
								<Button variant='destructive' size='icon'>
									<Icon name='Trash2' />
								</Button>
							</Tooltip>
						)}
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button variant='outline' size='icon' onClick={() => refetch()}>
								<Icon name='RotateCw' />
							</Button>
						</Tooltip>
					</Fragment>
				)
			}}
		/>
	)
}

export default ProductionImportList
