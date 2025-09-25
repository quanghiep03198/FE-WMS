import { CommonActions, RecordStatus } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IRFIDReaderDevice } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	DataTable,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/ui'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { useEventEmitter } from 'ahooks'
import { formatRelative } from 'date-fns'
import { capitalize, isNil, pick } from 'lodash'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
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

type TabValue = 'all' | 'recently-use' | 'deactivated'

const RFIDDeviceList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [currentTab, setCurrentTab] = useState<TabValue>('all')
	const { data, isLoading, refetch } = useGetRFIDDeviceQuery()
	const dateLocale = useDateLocale()
	const event$ = useEventEmitter<
		| { action: CommonActions.CREATE; defaultValues: null }
		| { action: CommonActions.UPDATE; defaultValues: UpdateRFIDReaderFormValues }
	>()

	const columnHelper = createColumnHelper<IRFIDReaderDevice>()
	const tableRef = useRef<Table<IRFIDReaderDevice>>(null)

	const { mutateAsync: updateAsync } = useUpdateRFIDDeviceMutation()
	const { mutateAsync: deleteAsync } = useDeleteRFIDDeviceMutation()

	const handleUpdateDeviceStatus = useCallback(async (payload: { device_sn: string; is_active: RecordStatus }) => {
		return await toast.promise(updateAsync(payload), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}, [])

	const handleDeleteDevices = useCallback(async (deviceSeriesNumbers: string[]) => {
		return await toast.promise(deleteAsync(deviceSeriesNumbers), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}, [])

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
				id: t('ns_rfid:fields.device_sn'),
				header: t('ns_rfid:fields.device_sn'),
				enableResizing: true,
				maxSize: 200
			}),
			columnHelper.accessor('station_no', {
				id: t('ns_rfid:fields.station_no'),
				header: t('ns_rfid:fields.station_no'),
				enableResizing: true,
				maxSize: 200
			}),
			columnHelper.display({
				id: t('ns_rfid:fields.device_type'),
				header: t('ns_rfid:fields.device_type'),
				enableResizing: true,
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
				id: 'TCP/IP',
				header: 'TCP/IP',
				maxSize: 100,
				enableResizing: true,
				cell: (info) => info.getValue()
			}),
			columnHelper.accessor('ip_port', {
				id: 'TCP/IP Port',
				header: 'TCP/IP Port',
				maxSize: 100,
				enableResizing: true,
				cell: (info) => info.getValue()
			}),
			columnHelper.accessor('is_active', {
				id: t('ns_common:common_fields.status'),
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
			columnHelper.accessor('last_used_time', {
				id: t('ns_rfid:fields.last_used_time'),
				header: t('ns_rfid:fields.last_used_time'),
				enableHiding: false,
				enableResizing: true,
				cell: (info) =>
					info.getValue() ? (
						capitalize(formatRelative(new Date(info.getValue()!), new Date(Date.now()), { locale: dateLocale }))
					) : (
						<Icon name='AlarmClockOff' stroke='hsl(var(--muted-foreground))' />
					),
				sortDescFirst: true
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

							<DropdownMenuGroup>
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
							</DropdownMenuGroup>

							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => handleDeleteDevices([row.original.device_sn])}>
									{t('ns_common:actions.delete')}
								</DropdownMenuItem>
							</DropdownMenuGroup>
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

	const tableData = useMemo(() => {
		if (!Array.isArray(data)) return []
		switch (currentTab) {
			case 'all':
				return data
			case 'recently-use':
				return data.filter((item) => !isNil(item.last_used_time))
			case 'deactivated':
				return data.filter((item) => item.is_active === RecordStatus.INACTIVE)
			default:
				return data
		}
	}, [data, currentTab])

	console.log('tableRef.current?.getSelectedRowModel() :>> ', tableRef.current?.getSelectedRowModel())

	return (
		<Fragment>
			<Tabs
				defaultValue='all'
				className='mt-6 flex flex-col'
				onValueChange={(value) => setCurrentTab(value as TabValue)}>
				<Div className='flex items-center justify-between'>
					<TabsList>
						<TabsTrigger value='all' className='group/tab-trigger gap-x-2'>
							{t('ns_common:others.all')}
						</TabsTrigger>
						<TabsTrigger value='recently-use' className='group/tab-trigger gap-x-2'>
							{t('ns_rfid:recently_use')}
							<Badge className='opacity-50 group-data-[state=active]/tab-trigger:opacity-100'>
								{recentlyUseCount}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value='deactivated' className='group/tab-trigger gap-x-2'>
							{t('ns_common:status.deactivated')}
							<Badge className='opacity-50 group-data-[state=active]/tab-trigger:opacity-100'>
								{deactivatedCount}
							</Badge>
						</TabsTrigger>
					</TabsList>
					<ButtonsGroup>
						{tableRef.current?.getSelectedRowModel()?.flatRows?.length > 0 && (
							<Button variant='destructive' onClick={() => refetch()}>
								<Icon name='Trash2' /> {t('ns_common:actions.delete')}
							</Button>
						)}
						<Button variant='outline' onClick={() => refetch()}>
							<Icon name='RotateCcw' /> {t('ns_common:actions.reload')}
						</Button>
						<Button
							variant='outline'
							onClick={() => event$.emit({ action: CommonActions.CREATE, defaultValues: null })}>
							<Icon name='CircleFadingPlus' /> {t('ns_common:actions.add')}
						</Button>
					</ButtonsGroup>
				</Div>
				<TabsContent value='all'>
					<DataTable
						ref={tableRef}
						border='bottom-only'
						data={tableData}
						columns={columns}
						loading={isLoading}
						containerProps={{
							className: 'h-80 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
						}}
						toolbarProps={{ hidden: true }}
						enableColumnResizing={true}
					/>
				</TabsContent>
				<TabsContent value='recently-use'>
					<DataTable
						ref={tableRef}
						border='bottom-only'
						data={tableData}
						columns={columns}
						loading={isLoading}
						containerProps={{
							className: 'h-80 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
						}}
						toolbarProps={{ hidden: true }}
						enableColumnResizing={true}
					/>
				</TabsContent>
				<TabsContent value='deactivated'>
					<DataTable
						ref={tableRef}
						border='bottom-only'
						data={tableData}
						columns={columns}
						loading={isLoading}
						containerProps={{
							className: 'h-80 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
						}}
						toolbarProps={{ hidden: true }}
						enableColumnResizing={true}
					/>
				</TabsContent>
			</Tabs>
			<RFIDDeviceFormDialog event$={event$} />
		</Fragment>
	)
}

const ButtonsGroup = tw.div`flex items-center gap-x-2`

export default RFIDDeviceList
