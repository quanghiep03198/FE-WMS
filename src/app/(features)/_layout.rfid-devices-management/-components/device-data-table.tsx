import { RecordStatus, UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { IRFIDReaderDevice } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Badge, Button, DataTable, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { notNullFilter } from '@/components/ui/@react-table/utils/not-null-filter.util'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { formatRelative } from 'date-fns'
import { capitalize, isNil } from 'lodash-es'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
	useDeleteRFIDDeviceMutation,
	useGetRFIDDeviceQuery,
	useUpdateRFIDDeviceMutation
} from '../-hooks/use-rfid-device-asm'
import ActionDropdown from './action-dropdown'

const DeviceDataTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { user } = useAuth()
	const { data, isLoading, refetch } = useGetRFIDDeviceQuery()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const dateLocale = useDateLocale()

	const columnHelper = createColumnHelper<IRFIDReaderDevice>()
	const tableRef = useReactiveRef<Table<IRFIDReaderDevice>>(null)
	const deleteItemsRef = useRef<string[]>(null)

	const { mutateAsync: updateAsync } = useUpdateRFIDDeviceMutation()
	const { mutateAsync: deleteAsync, isPending: isDeleting, isError: isFailedToDelete } = useDeleteRFIDDeviceMutation()

	const handleUpdateDeviceStatus = useCallback((payload: { device_sn: string; is_active: RecordStatus }) => {
		return toast.promise(updateAsync(payload), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}, [])

	const handleDeleteDevices = useCallback(() => {
		return toast.promise(deleteAsync(deleteItemsRef.current), {
			loading: t('ns_common:notification.processing_request'),
			success: () => {
				deleteItemsRef.current = []
				return t('ns_common:notification.success')
			},
			error: t('ns_common:notification.error')
		})
	}, [deleteItemsRef.current])

	const shouldDisableDelete = useMemo(
		() => user && Array.isArray(user.roles) && !user.roles.some((role) => role === UserRole.ADMIN),
		[user]
	)

	const columns = useMemo(() => {
		return [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => <IndeterminateCheckbox {...props} disabled={shouldDisableDelete} />,
				cell: (props) => <RowSelectionCheckbox {...props} disabled={shouldDisableDelete} />,
				size: 60,
				maxSize: 60,
				enableResizing: false
			}),
			columnHelper.accessor('device_sn', {
				id: 'device_sn',
				header: t('ns_rfid:fields.device_sn'),
				enableColumnFilter: true,
				maxSize: 150
			}),
			columnHelper.accessor('station_no', {
				id: 'station_no',
				header: t('ns_rfid:fields.station_no'),
				enableResizing: true,
				enableColumnFilter: true,
				size: 100,
				maxSize: 200,
				cell: ({ getValue }) => {
					const value = getValue()
					return value.split('_').at(-1)
				}
			}),
			columnHelper.display({
				id: 'device_type',
				header: t('ns_rfid:fields.device_type'),
				enableResizing: true,
				enableColumnFilter: false,
				minSize: 200,
				cell: ({ row }) =>
					isNil(row.original.device_ant) || row.original.device_ant === '0' ? (
						<Badge variant='secondary' className='gap-x-2'>
							<Icon name='SmartphoneNfc' /> Handhold
						</Badge>
					) : (
						<Badge variant='secondary' className='gap-x-2'>
							<Icon name='Router' /> Attenna
						</Badge>
					)
			}),
			columnHelper.accessor('ip_address', {
				id: 'ip_address',
				header: 'TCP/IP',
				maxSize: 100,
				enableResizing: true,
				cell: (info) => info.getValue()
			}),
			columnHelper.accessor('ip_port', {
				id: 'ip_port',
				header: 'TCP/IP Port',
				maxSize: 100,
				enableResizing: true,
				cell: (info) => info.getValue()
			}),
			columnHelper.accessor('last_used_time', {
				id: 'last_used_time',
				header: t('ns_rfid:fields.last_used_time'),
				enableHiding: false,
				enableResizing: true,
				enableColumnFilter: true,
				filterFn: notNullFilter,
				minSize: 250,
				cell: (info) =>
					info.getValue() ? (
						capitalize(formatRelative(new Date(info.getValue()!), new Date(Date.now()), { locale: dateLocale }))
					) : (
						<Icon name='AlarmClockOff' stroke='hsl(var(--muted-foreground))' />
					),
				sortDescFirst: true
			}),
			columnHelper.accessor('is_active', {
				id: 'is_active',
				header: t('ns_common:common_fields.status'),
				enableResizing: true,
				enableColumnFilter: true,
				cell: (info) => (
					<Badge variant='outline' className={cn('justify-center gap-x-2 whitespace-nowrap rounded')}>
						{info.getValue() === RecordStatus.ACTIVE ? (
							<Fragment>
								<Icon name='CircleCheck' className='size-4 fill-success stroke-success-foreground' />
								{t('ns_common:status.active')}
							</Fragment>
						) : (
							<Fragment>
								<Icon name='CircleMinus' className='size-4 stroke-muted-foreground' />
								{t('ns_common:status.deactivated')}
							</Fragment>
						)}
					</Badge>
				)
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: '-',
				meta: { align: 'center' },
				size: 60,
				maxSize: 60,
				enableHiding: false,
				cell: (props) => (
					<ActionDropdown
						{...props}
						onUpdateStatus={handleUpdateDeviceStatus}
						onDelete={() => {
							deleteItemsRef.current = [props.row.original.device_sn]
							setConfirmDialogOpen(true)
						}}
					/>
				)
			})
		]
	}, [i18n.language])

	return (
		<Fragment>
			<DataTable
				ref={tableRef}
				data={data}
				columns={columns}
				loading={isLoading}
				enableColumnFilters={true}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							{tableRef.current?.getFilteredSelectedRowModel()?.flatRows?.length > 0 && (
								<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => {
											deleteItemsRef.current =
												table
													?.getFilteredSelectedRowModel()
													?.flatRows?.map((row) => row.original.device_sn) ?? []
											setConfirmDialogOpen(true)
										}}>
										<Icon name='Trash2' />
									</Button>
								</Tooltip>
							)}
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<Button size='sm' variant='outline' onClick={() => refetch()}>
									<Icon name='RefreshCcw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
				enableColumnResizing={true}
			/>

			<ConfirmDialog
				open={confirmDialogOpen || isDeleting || isFailedToDelete}
				onOpenChange={setConfirmDialogOpen}
				isPending={isDeleting}
				isError={isFailedToDelete}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={handleDeleteDevices}
				onCancel={() => {
					deleteItemsRef.current = []
				}}
			/>
		</Fragment>
	)
}

export default DeviceDataTable
