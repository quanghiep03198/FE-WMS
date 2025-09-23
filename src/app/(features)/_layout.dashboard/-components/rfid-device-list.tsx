import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Checkbox,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

const RFIDDeviceList: React.FC = () => {
	const { t } = useTranslation()
	const { data, isLoading } = useQuery({
		queryKey: ['WAREHOUSE_RFID_DEVICES'],
		queryFn: () => RFIDService.getWarehouseRFIDDevices(),
		refetchInterval: 5000,
		select: (response) => response.metadata
	})

	return (
		<Div className='flex h-full flex-col space-y-8 overflow-hidden rounded-lg border py-6 shadow'>
			<Div className='sticky top-0 flex items-start justify-between px-6'>
				<Div>
					<Typography className='font-medium'>{t('ns_rfid:devices')}</Typography>
					<Typography variant='small' className='text-pretty text-muted-foreground'>
						{t('ns_rfid:devices_description')}
					</Typography>
				</Div>
				<Button variant='outline'>
					<Icon name='CircleFadingPlus' role='presentation' /> {t('ns_common:actions.add')}
				</Button>
			</Div>
			<ScrollShadow className='max-h-[50vh] flex-1 basis-full space-y-8 overflow-y-auto px-6 @container'>
				<Table className='w-full table-fixed'>
					<TableHeader className='sticky top-0 border-b'>
						<TableRow className='[&_th]:border-x-0'>
							<TableHead align='left' className='w-16'>
								<Checkbox />
							</TableHead>
							<TableHead align='left'>Device name</TableHead>
							<TableHead align='left'>Created by</TableHead>
							<TableHead align='left'>Device type</TableHead>
							<TableHead align='left'>TCP/IP</TableHead>
							<TableHead align='left'>Port</TableHead>
							<TableHead align='left'>Attena</TableHead>
							<TableHead align='left'>Device status</TableHead>
							<TableHead align='left'>
								<Typography className='inline-flex items-center gap-x-2'>
									<Icon name='Clock' /> Last use
								</Typography>
							</TableHead>
							<TableHead align='center' className='w-16'>
								<Typography className='sr-only'>Actions</Typography>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='divide-y'>
						{Array.isArray(data) && data.length > 0 ? (
							data.map((device, index) => (
								<TableRow key={index} className='divide-x-0 [&_td]:!border-b-0'>
									<TableCell align='left' className='w-16'>
										<Checkbox />
									</TableCell>
									<TableCell>
										<Div>
											<Typography variant='small' className='font-medium'>
												{device?.device_sn}
											</Typography>
											<Typography variant='small' color='muted' className='block'>
												{device?.device_name}
											</Typography>
										</Div>
									</TableCell>
									<TableCell>{device?.created ?? 'Administrator'}</TableCell>
									<TableCell align='left'>
										<Badge
											variant='outline'
											className='inline-flex w-fit items-center justify-center gap-x-2 text-muted-foreground'>
											<Icon
												name={device.device_name?.includes('WH103') ? 'SmartphoneNfc' : 'Router'}
												className='stroke-foreground'
											/>
											{device.device_name?.includes('WH103') ? 'Handhold' : 'Attenna'}
										</Badge>
									</TableCell>
									<TableCell>{device?.ip_address}</TableCell>
									<TableCell>{device?.ip_port}</TableCell>
									<TableCell align='left'>
										{device.device_name?.includes('WH103') ? (
											<Badge variant='secondary'>N/A</Badge>
										) : (
											<Div className='flex items-center gap-x-2 *:whitespace-nowrap'>
												<Badge variant='secondary'>Attena 1</Badge>
												<Badge variant='secondary'>Attena 2</Badge>
											</Div>
										)}
									</TableCell>
									<TableCell align='left'>
										<Badge
											variant='outline'
											className={cn('justify-center gap-x-2 whitespace-nowrap rounded')}>
											{device.is_active === 'Y' ? (
												<Fragment>
													<Icon
														name='CircleCheck'
														className='size-4 fill-success stroke-success-foreground'
													/>
													{t('ns_common:status.active')}
												</Fragment>
											) : (
												<Fragment>
													<Icon name='CircleMinus' className='size-4' />
													{t('ns_common:status.deactivated')}
												</Fragment>
											)}
										</Badge>
									</TableCell>
									<TableCell className='lowercase first-letter:uppercase'>
										{device.last_usage_time
											? formatRelative(new Date(Date.now()), new Date(device.last_usage_time))
											: '-'}
									</TableCell>

									<TableCell align='center' className='w-16'>
										<DropdownMenu>
											<DropdownMenuTrigger>
												<Icon name='Ellipsis' />
											</DropdownMenuTrigger>
											<DropdownMenuContent side='left' align='start'>
												<DropdownMenuGroup>
													<DropdownMenuItem>Activate</DropdownMenuItem>
													<DropdownMenuItem>Deactivate</DropdownMenuItem>
												</DropdownMenuGroup>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align='center' className='h-64'>
									<Typography
										as='small'
										variant='small'
										className='inline-flex items-center justify-center gap-x-2'>
										<Icon name='Inbox' className='size-6' strokeWidth={1.25} />
										{t('ns_common:table.no_data')}
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ScrollShadow>
		</Div>
	)
}

export default RFIDDeviceList
