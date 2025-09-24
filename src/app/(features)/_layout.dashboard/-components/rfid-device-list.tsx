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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Typography
} from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { useEventEmitter } from 'ahooks'
import { formatRelative } from 'date-fns'
import { capitalize, isNil } from 'lodash'
import React, { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetRFIDDeviceQuery } from '../-hooks/use-rfid-device-asm'
import RFIDDeviceFormDialog from './rfid-device-form-dialog'

type TabValue = 'all' | 'recently-use' | 'deactivated'

const RFIDDeviceList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [currentTab, setCurrentTab] = useState<TabValue>('all')
	const { data, isLoading, refetch } = useGetRFIDDeviceQuery()
	const dateLocale = useDateLocale()
	const event$ = useEventEmitter<
		| { action: CommonActions.CREATE; defaultValues: null }
		| { action: CommonActions.UPDATE; defaultValues: Partial<IRFIDReaderDevice> }
	>()

	const columnHelper = createColumnHelper<IRFIDReaderDevice>()

	const columns = useMemo(() => {
		return [
			columnHelper.accessor('device_sn', {
				id: t('ns_rfid:fields.device_name'),
				header: t('ns_rfid:fields.device_name'),
				enableResizing: true,
				maxSize: 200,
				cell: ({ row }) => (
					<Div className='flex flex-col'>
						<Typography variant='small' className='font-medium'>
							{row.original?.device_sn}
						</Typography>
						<Typography variant='small' color='muted' className='text-xs'>
							{row.original?.device_name}
						</Typography>
					</Div>
				)
			}),
			columnHelper.display({
				id: t('ns_rfid:fields.device_type'),
				header: t('ns_rfid:fields.device_type'),
				enableResizing: true,
				cell: ({ row }) =>
					isNil(row.original.device_ant) ? (
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
			columnHelper.accessor('device_ant', {
				id: 'Atenna',
				header: 'Atenna',
				enableResizing: true,
				minSize: 250,
				cell: (info) => {
					const value = info.getValue()
					return isNil(value) || value === '0' ? (
						<Icon name='CircleSlash2' stroke='hsl(var(--muted-foreground))' />
					) : (
						<EllipsisList
							threshhold={2}
							data={typeof value === 'string' ? value.split(',') : []}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									Attena {data}
								</Badge>
							)}
						/>
					)
				}
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
								onClick={() => event$.emit({ action: CommonActions.UPDATE, defaultValues: row.original })}>
								{t('ns_common:actions.update')}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>{t('ns_common:actions.activate')}</DropdownMenuItem>
								<DropdownMenuItem>{t('ns_common:actions.deactivate')}</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>{t('ns_common:actions.delete')}</DropdownMenuItem>
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

	return (
		<Fragment>
			<Div className='flex h-full flex-col space-y-8 overflow-hidden py-6'>
				<Div className='sticky top-0 flex items-start justify-between'>
					<Div>
						<Typography className='font-medium'>{t('ns_rfid:devices')}</Typography>
						<Typography variant='small' className='text-pretty text-muted-foreground'>
							{t('ns_rfid:devices_description')}
						</Typography>
					</Div>
				</Div>
				<Tabs
					defaultValue='all'
					className='flex flex-col'
					onValueChange={(value) => setCurrentTab(value as TabValue)}>
					<Div className='flex items-center justify-between'>
						<TabsList>
							<TabsTrigger value='all'>{t('ns_common:others.all')}</TabsTrigger>
							<TabsTrigger value='recently-use' className='gap-x-2'>
								{t('ns_rfid:recently_use')}
								<Badge className='aspect-square max-h-full min-h-3 w-3 justify-center rounded-full'>
									{recentlyUseCount}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value='deactivated' className='gap-x-2 py-1'>
								{t('ns_common:status.deactivated')}
								<Badge className='aspect-square max-h-full min-h-3 w-3 justify-center rounded-full'>
									{deactivatedCount}
								</Badge>
							</TabsTrigger>
						</TabsList>
						<ButtonsGroup>
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
							border='bottom-only'
							data={tableData}
							columns={columns}
							loading={isLoading}
							containerProps={{
								className: 'h-96 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
							}}
							toolbarProps={{ hidden: true }}
							enableColumnResizing={true}
						/>
					</TabsContent>
					<TabsContent value='recently-use'>
						<DataTable
							border='bottom-only'
							data={tableData}
							columns={columns}
							loading={isLoading}
							containerProps={{
								className: 'h-96 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
							}}
							toolbarProps={{ hidden: true }}
							enableColumnResizing={true}
						/>
					</TabsContent>
					<TabsContent value='deactivated'>
						<DataTable
							border='bottom-only'
							data={tableData}
							columns={columns}
							loading={isLoading}
							containerProps={{
								className: 'h-96 [&_th]:!border-x-0 [&_td]:!border-x-0 [&_td]:!shadow-none [&_th]:!shadow-none'
							}}
							toolbarProps={{ hidden: true }}
							enableColumnResizing={true}
						/>
					</TabsContent>
				</Tabs>
			</Div>
			<RFIDDeviceFormDialog event$={event$} />
		</Fragment>
	)
}

const ButtonsGroup = tw.div`flex items-center gap-x-2`

export default RFIDDeviceList
