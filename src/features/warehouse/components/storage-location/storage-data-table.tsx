// #region Modules
import { CommonActions } from '@common/constants/enums'
import generateAvatar from '@common/utils/generate-avatar'
import { default as DataTable } from '@components/addons/tanstack-table'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@components/addons/tanstack-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@components/addons/tanstack-table/constants'
import { fuzzySort } from '@components/addons/tanstack-table/utils/fuzzy-sort.util'
import ConfirmDialog from '@components/customs/confirm-dialog'
import { Tooltip } from '@components/customs/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@components/ui/item'
import { useStorageLocationPageContext } from '@features/warehouse/contexts/storage-location-page-context'
import { useGetOneWarehouseQuery } from '@features/warehouse/hooks/use-warehouse-request'
import type { IStorageLocation } from '@features/warehouse/types'
import { useParams } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { Fragment, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteStorageMutation } from '../../hooks/use-warehouse-storage-request'
import StorageRowActions from './storage-row-actions'
// #endregion

const StorageList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const tableRef = useRef<Table<any>>({} as Table<any>)
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const warehouseName = useParams({
		strict: true,
		from: '/(features)/_layout/(warehouse)/storage-locations/$warehouseName',
		select: (params) => params.warehouseName
	})
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { data, isLoading, refetch } = useGetOneWarehouseQuery(warehouseName)

	const { event$ } = useStorageLocationPageContext()

	const handleResetAllRowSelection = () => {
		if (tableRef.current) tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}

	const handleDeleteSelectedRows = async () => {
		if (tableRef.current) {
			await deleteWarehouseStorage(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original?.id))
			handleResetAllRowSelection()
		}
	}

	// Delete selected warehouse storage locations
	const { mutateAsync: deleteWarehouseStorage } = useDeleteStorageMutation(warehouseName)

	const columnHelper = createColumnHelper<IStorageLocation>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
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
				enableResizing: false
			}),

			columnHelper.accessor('name', {
				header: t('ns_warehouse:fields.storage_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
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
						<Item className='p-0' size='sm'>
							<ItemMedia>
								<Avatar className='size-7'>
									<AvatarImage src={generateAvatar({ name: user.display_name })} />
									<AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent className='gap-0!'>
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
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? format(value, 'yyyy-MM-dd HH:mm') : <span className='text-muted-foreground'>-</span>
				}
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
						<Item className='p-0' size='sm'>
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
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? format(value, 'yyyy-MM-dd HH:mm') : <span className='text-muted-foreground'>-</span>
				}
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				size: 100,
				maxSize: 100,
				cell: ({ row }) => {
					return (
						<StorageRowActions
							row={row}
							onDelete={() => {
								setConfirmDialogOpen(!confirmDialogOpen)
								row.toggleSelected(true)
								setRowSelectionType('single')
							}}
							onEdit={() => {
								event$.emit({
									action: CommonActions.UPDATE,
									payload: row.original
								})
							}}
						/>
					)
				}
			})
		],
		[i18n.language]
	)

	return (
		<Fragment>
			<DataTable
				columns={columns}
				containerProps={{ style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' } }}
				data={data?.storage_locations}
				enableColumnFilters={true}
				enableColumnResizing={true}
				enableRowSelection={true}
				loading={isLoading}
				ref={tableRef}
				virtualizerOptions={{ estimateSize: 50 }}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							{table.getSelectedRowModel().flatRows.length > 0 && rowSelectionType === 'multiple' && (
								<Tooltip message={t('ns_common:actions.add')} triggerProps={{ asChild: true }}>
									<Button
										size='icon'
										variant='destructive'
										onClick={() => setConfirmDialogOpen((prev) => !prev)}>
										<Icon name='Trash2' />
									</Button>
								</Tooltip>
							)}
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<Button size='icon' variant='outline' onClick={() => refetch()}>
									<Icon name='RefreshCcw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
			<ConfirmDialog
				description={t('ns_common:confirmation.delete_description')}
				open={confirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				onCancel={handleResetAllRowSelection}
				onConfirm={handleDeleteSelectedRows}
				onOpenChange={setConfirmDialogOpen}
			/>
		</Fragment>
	)
}

export default StorageList
