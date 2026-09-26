// #region Modules
import { CommonActions } from '@common/constants/enums'
import formatIntlNumber from '@common/utils/format-intl-number'
import generateAvatar from '@common/utils/generate-avatar'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DataTable,
	Icon,
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
	Tooltip
} from '@components/ui'
import ConfirmDialog from '@components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@components/ui/@react-table/constants'
import { fuzzySort } from '@components/ui/@react-table/utils/fuzzy-sort.util'
import { useWarehousePageContext } from '@features/warehouse/contexts/warehouse-page-context'
import type { IWarehouse } from '@features/warehouse/types'
import type { Row, Table } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { Fragment, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteWarehouseMutation, useGetWarehouseQuery } from '../../hooks/use-warehouse-request'
import WarehouseRowActions from './warehouse-row-actions'
// #endregion

// #region React Component
const WarehouseDataTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const tableRef = useRef<Table<IWarehouse | null>>(null!)
	const { event$ } = useWarehousePageContext()

	// Handle reset row deletion
	const handleResetAllRowSelection = () => {
		if (tableRef.current) {
			tableRef.current.resetRowSelection()
			resetRowSelectionType()
		}
	}

	// Handle delete selected row(s)
	const handleDeleteSelectedRows = () => {
		if (tableRef.current) {
			deleteWarehouseAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => String(item.original?._id)))
		}
	}

	const handlePreUpdate = (row: Row<IWarehouse>) => {
		event$.emit({
			action: CommonActions.UPDATE,
			payload: row.original
		})
	}

	const handlePreDelete = (row: Row<IWarehouse>) => {
		setConfirmDialogOpen(!confirmDialogOpen)
		setRowSelectionType('single')
		row.toggleSelected(true)
	}

	// Get warehouse data
	const { data, isLoading, refetch } = useGetWarehouseQuery()

	// Delete warehouse
	const { mutateAsync: deleteWarehouseAsync } = useDeleteWarehouseMutation(handleResetAllRowSelection)

	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('_id', {
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => (
					<IndeterminateCheckbox
						{...props}
						onCheckedChange={(checked) => {
							if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
				cell: (props) => (
					<RowSelectionCheckbox
						{...props}
						onCheckedChange={(checked) => {
							if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
				size: 50,
				maxSize: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false,
				enableGlobalFilter: false,
				enableColumnFilter: false
			}),
			columnHelper.accessor('name', {
				id: 'name',
				header: t('ns_warehouse:fields.warehouse_name'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('capacity', {
				id: 'capacity',
				header: t('ns_warehouse:fields.storage_capacity'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'inNumberRange',
				sortingFn: fuzzySort,
				meta: { filterVariant: 'range' },
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('created_by', {
				header: t('ns_common:common_fields.created_by'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => {
					const user = getValue()
					return (
						<Item size='sm' className='p-0'>
							<ItemMedia>
								<Avatar className='size-8'>
									<AvatarImage src={generateAvatar({ name: user.display_name })} />
									<AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent className='gap-0'>
								<ItemTitle>{user.display_name}</ItemTitle>
								<ItemDescription className='before:content-["@"]'>{user.username}</ItemDescription>
							</ItemContent>
						</Item>
					)
				}
			}),
			columnHelper.accessor('created_at', {
				header: t('ns_common:common_fields.created_at'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'inDateRange',
				sortingFn: fuzzySort,
				meta: { filterVariant: 'date' },
				cell: ({ getValue }) => format(getValue(), 'yyyy-MM-dd HH:mm')
			}),
			columnHelper.accessor('updated_by', {
				header: t('ns_common:common_fields.updated_by'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => {
					const user = getValue()
					if (!user) return
					return (
						<Item size='sm' className='p-0'>
							<ItemMedia>
								<Avatar className='size-8'>
									<AvatarImage src={generateAvatar({ name: user.display_name })} />
									<AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent className='gap-0'>
								<ItemTitle>{user.display_name}</ItemTitle>
								<ItemDescription className='before:content-["@"]'>{user.username}</ItemDescription>
							</ItemContent>
						</Item>
					)
				}
			}),
			columnHelper.accessor('updated_at', {
				header: t('ns_common:common_fields.updated_at'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'inDateRange',
				sortingFn: fuzzySort,
				meta: { filterVariant: 'date' },
				cell: ({ getValue }) =>
					getValue() ? format(getValue(), 'yyyy-MM-dd HH:mm') : <span className='text-muted-foreground'>-</span>
			}),
			columnHelper.accessor('_id', {
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				size: 100,
				maxSize: 100,
				enableResizing: false,
				enableHiding: false,
				enablePinning: false,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<WarehouseRowActions
						row={row}
						onDelete={() => handlePreDelete(row)}
						onEdit={() => handlePreUpdate(row)}
					/>
				)
			})
		],
		[i18n.language]
	)

	return (
		<Fragment>
			<DataTable
				data={data!}
				columns={columns}
				loading={isLoading}
				enableColumnResizing={true}
				enableRowSelection={true}
				ref={tableRef}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							{table.getSelectedRowModel().flatRows.length > 0 && rowSelectionType == 'multiple' && (
								<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => setConfirmDialogOpen(!confirmDialogOpen)}>
										<Icon name='Trash2' />
									</Button>
								</Tooltip>
							)}
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.reload')}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='RefreshCcw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={handleDeleteSelectedRows}
				onCancel={handleResetAllRowSelection}
			/>
		</Fragment>
	)
}

export default WarehouseDataTable
