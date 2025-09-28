import { CommonActions, RecordStatus } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { IRFIDReaderDevice } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	DataTable,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { notNullFilter } from '@/components/ui/@react-table/utils/not-full-filter.util'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { useEventEmitter } from 'ahooks'
import { formatRelative } from 'date-fns'
import { capitalize, isNil, pick } from 'lodash'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import {
	useDeleteRFIDDeviceMutation,
	useGetRFIDDeviceQuery,
	useUpdateRFIDDeviceMutation
} from '../-hooks/use-rfid-device-asm'
import { UpdateRFIDReaderFormValues } from '../-schemas/rfid-reader.schema'
import RFIDDeviceFormDialog from './rfid-device-form-dialog'

const RFIDDeviceList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useGetRFIDDeviceQuery()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const dateLocale = useDateLocale()
	const ev$ = useEventEmitter<
		| { action: CommonActions.CREATE; defaultValues: null }
		| { action: CommonActions.UPDATE; defaultValues: UpdateRFIDReaderFormValues }
	>()

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
				size: 80,
				maxSize: 80,
				enableResizing: false
			}),
			columnHelper.accessor('device_sn', {
				id: 'device_sn',
				header: t('ns_rfid:fields.device_sn'),
				maxSize: 150
			}),
			columnHelper.accessor('station_no', {
				id: 'station_no',
				header: t('ns_rfid:fields.station_no'),
				enableResizing: true,
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
				filterFn: notNullFilter,
				enableColumnFilter: true,
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
									ev$.emit({
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

	const recentlyUseCount = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.filter((item) => !isNil(item.last_used_time)).length
	}, [data])

	const deactivatedCount = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.filter((item) => item.is_active === RecordStatus.INACTIVE).length
	}, [data])

	const tabIndicatorRef = useRef<HTMLDivElement>(null)
	const tabTriggerRefs = useRef<Array<HTMLButtonElement | null>>([])
	const currentTabValue = tableRef.current?.getColumn('is_active')?.getFilterValue()

	useEffect(() => {
		// deleteItemsRef.current =
		// 	tableRef.current?.getFilteredSelectedRowModel()?.flatRows?.map((row) => row.original.device_sn) ?? []
		switch (currentTabValue) {
			case RecordStatus.ACTIVE:
				requestAnimationFrame(() => {
					tabIndicatorRef.current.style.transform = `translate(${tabTriggerRefs.current?.[0]?.offsetWidth}px, -50%)`
					tabIndicatorRef.current.style.width = `${tabTriggerRefs.current?.[1].offsetWidth}px`
				})
				break
			case RecordStatus.INACTIVE:
				requestAnimationFrame(() => {
					tabIndicatorRef.current.style.transform = `translate(${tabTriggerRefs.current?.[0]?.offsetWidth + tabTriggerRefs.current?.[1]?.offsetWidth}px, -50%)`
					tabIndicatorRef.current.style.width = `${tabTriggerRefs.current?.[2].offsetWidth}px`
				})
				break
			default:
				requestAnimationFrame(() => {
					tabIndicatorRef.current.style.transform = `translate(0px, -50%)`
					tabIndicatorRef.current.style.width = `${tabTriggerRefs.current?.[0].offsetWidth}px`
				})
				break
		}
	}, [currentTabValue])

	return (
		<Fragment>
			<DataTable
				ref={tableRef}
				border='bottom-only'
				data={data}
				columns={columns}
				loading={isLoading}
				enableHiding={false}
				enableGlobalFilter={false}
				containerProps={{
					className: 'h-80 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
				}}
				toolbarProps={{
					override: true,
					render: ({ table, event$ }) => (
						<Div className='flex items-center justify-between py-1'>
							<TabsList role='tab'>
								<TabsIndicator ref={tabIndicatorRef} />
								<TabsTrigger
									data-state={!currentTabValue ? 'active' : 'inactive'}
									ref={(e) => {
										tabTriggerRefs.current[0] = e
									}}
									onClick={() => {
										table.resetColumnFilters()
										event$.emit(pick(table.getState(), ['rowSelection']))
									}}>
									{t('ns_common:others.all')}
									<Badge data-role='badge'>{data?.length}</Badge>
								</TabsTrigger>
								<TabsTrigger
									data-state={currentTabValue === RecordStatus.ACTIVE ? 'active' : 'inactive'}
									ref={(e) => {
										tabTriggerRefs.current[1] = e
									}}
									onClick={() => {
										table.resetColumnFilters()
										table.getColumn('is_active').setFilterValue(RecordStatus.ACTIVE)
										table.getColumn('last_used_time').setFilterValue(new Date().toISOString())
										event$.emit(pick(table.getState(), ['rowSelection']))
									}}>
									{t('ns_rfid:recently_use')}
									<Badge data-role='badge'>{recentlyUseCount}</Badge>
								</TabsTrigger>
								<TabsTrigger
									data-state={currentTabValue === RecordStatus.INACTIVE ? 'active' : 'inactive'}
									ref={(e) => {
										tabTriggerRefs.current[2] = e
									}}
									onClick={() => {
										table.resetColumnFilters()
										table.getColumn('is_active').setFilterValue(RecordStatus.INACTIVE)
										event$.emit(pick(table.getState(), ['rowSelection']))
									}}>
									{t('ns_common:status.deactivated')}
									<Badge data-role='badge'>{deactivatedCount}</Badge>
								</TabsTrigger>
							</TabsList>
							<ButtonsGroup>
								{tableRef.current?.getFilteredSelectedRowModel()?.flatRows?.length > 0 && (
									<Button
										variant='destructive'
										size='sm'
										onClick={() => {
											deleteItemsRef.current =
												tableRef.current
													?.getFilteredSelectedRowModel()
													?.flatRows?.map((row) => row.original.device_sn) ?? []
											setConfirmDialogOpen(true)
										}}>
										<Icon name='Trash2' /> {t('ns_common:actions.delete')}
									</Button>
								)}
								<Button variant='outline' size='sm' onClick={() => refetch()}>
									<Icon name='RotateCcw' /> {t('ns_common:actions.reload')}
								</Button>
								<Button
									size='sm'
									onClick={() => ev$.emit({ action: CommonActions.CREATE, defaultValues: null })}>
									<Icon name='CircleFadingPlus' /> {t('ns_common:actions.add')}
								</Button>
							</ButtonsGroup>
						</Div>
					)
				}}
				enableColumnResizing={true}
			/>
			<RFIDDeviceFormDialog event$={ev$} />
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

const TabsList = tw.div`isolate flex items-center p-1 bg-accent rounded-md relative overflow-hidden`
const TabsTrigger = tw.button`
	text-sm inline-flex items-center justify-between gap-x-2 z-20 px-3 h-8 font-medium text-accent-foreground
	[&_div[data-role=badge]]:rounded-sm
	[&_div[data-role=badge]]:!text-xs
	[&_div[data-role=badge]]:opacity-50 
	[&_div[data-role=badge]]:transition-opacity 
	[&_div[data-role=badge]]:duration-500 
	[&_div[data-role=badge]]:ease 
	[&[data-state=active]_*[data-role=badge]]:opacity-100 
	`
const TabsIndicator = tw.div`absolute rounded-md top-1/2 h-[calc(100%-8px)] w-auto z-0 bg-background transition-[transform,width] duration-200 ease-in-out`
const ButtonsGroup = tw.div`flex items-center gap-x-2`

export default RFIDDeviceList
