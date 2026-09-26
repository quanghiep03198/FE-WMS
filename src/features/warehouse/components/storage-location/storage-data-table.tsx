// #region Modules
import { CommonActions } from '@common/constants/enums'
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
				ref={tableRef}
				data={data?.storage_locations!}
				loading={isLoading}
				columns={columns}
				enableColumnResizing={true}
				enableColumnFilters={true}
				enableRowSelection={true}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							{table.getSelectedRowModel().flatRows.length > 0 && rowSelectionType === 'multiple' && (
								<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => setConfirmDialogOpen((prev) => !prev)}>
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

export default StorageList
