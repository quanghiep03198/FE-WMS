import { CommonActions, RecordStatus } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { IRFIDReaderDevice } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	DataTable,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { notNullFilter } from '@/components/ui/@react-table/utils/not-full-filter.util'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { formatRelative } from 'date-fns'
import { capitalize, isNil, pick } from 'lodash'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { usePageContext } from '../-contexts/page-context'
import {
	useDeleteRFIDDeviceMutation,
	useGetRFIDDeviceQuery,
	useUpdateRFIDDeviceMutation
} from '../-hooks/use-rfid-device-asm'

const RFIDDeviceList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useGetRFIDDeviceQuery()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const dateLocale = useDateLocale()
	const { event$ } = usePageContext()

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

	const columns = useMemo(() => {
		return [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => <IndeterminateCheckbox {...props} />,
				cell: (props) => <RowSelectionCheckbox {...props} />,
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
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger className='text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'>
							<Icon name='Ellipsis' />
						</DropdownMenuTrigger>
						<DropdownMenuContent side='left' align='start'>
							<DropdownMenuItem
								onClick={() =>
									event$.emit({
										action: CommonActions.UPDATE,
										defaultValues: {
											...pick(row.original, ['station_no', 'device_sn', 'ip_address', 'ip_port']),
											device_ant:
												row.original.device_ant === '0' || isNil(row.original.device_ant) ? '0' : '1'
										}
									})
								}>
								{t('ns_common:actions.update')}
							</DropdownMenuItem>

							{row.original.is_active === RecordStatus.INACTIVE ? (
								<DropdownMenuItem
									onClick={() =>
										handleUpdateDeviceStatus({
											device_sn: row.original.device_sn,
											is_active: RecordStatus.ACTIVE
										})
									}>
									{t('ns_common:actions.activate')}
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									onClick={() =>
										handleUpdateDeviceStatus({
											device_sn: row.original.device_sn,
											is_active: RecordStatus.INACTIVE
										})
									}>
									{t('ns_common:actions.deactivate')}
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									deleteItemsRef.current = [row.original.device_sn]
									setConfirmDialogOpen(true)
								}}>
								{t('ns_common:actions.delete')}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
				containerProps={{ className: 'h-[35vh]' }}
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
									<Icon name='RotateCcw' />
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

export default RFIDDeviceList
