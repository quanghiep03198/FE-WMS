import { Badge, Div, Icon, Typography } from '@/components/ui'
import { RFIDService } from '@/services/rfid.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RFIDDeviceList: React.FC = () => {
	const { t } = useTranslation()
	const { data } = useQuery({
		queryKey: ['WAREHOUSE_RFID_DEVICES'],
		queryFn: () => RFIDService.getWarehouseRFIDDevices(),
		select: (response) => response.metadata
	})

	return (
		<Div className='flex h-full flex-col space-y-8 overflow-hidden rounded-lg border p-6 shadow'>
			<Div className='sticky top-0'>
				<Typography className='font-medium'>{t('ns_rfid:devices')}</Typography>
				<Typography variant='small' className='text-pretty text-muted-foreground'>
					{t('ns_rfid:devices_description')}
				</Typography>
			</Div>
			<Div className='max-h-[45vh] flex-1 basis-full space-y-8 overflow-y-auto !scrollbar-none @container'>
				{Array.isArray(data) && data.length > 0 ? (
					data.map((device, index) => (
						<Div key={index} className='flex items-start justify-between gap-x-6'>
							<Div className='basis-full lg:basis-1/2'>
								<Div className='flex items-stretch gap-x-3'>
									<Div className='flex size-9 items-center justify-center rounded-md bg-accent'>
										<Icon
											name={device.device_name?.includes('WH103') ? 'SmartphoneNfc' : 'Router'}
											size={18}
										/>
									</Div>
									<Div>
										<Typography variant='small' className='font-medium'>
											{device?.device_name}
										</Typography>
										<Typography variant='small' color='muted'>
											{device?.device_sn}
										</Typography>
									</Div>
								</Div>
							</Div>
							<Badge variant='outline' className='justify-center whitespace-nowrap rounded'>
								{device.is_active === 'Y' ? t('ns_common:status.active') : t('ns_common:status.deactivated')}
							</Badge>
						</Div>
					))
				) : (
					<Div className='grid h-full place-content-center rounded-md bg-muted text-muted-foreground'>
						<Typography as='small' variant='small' className='inline-flex items-center justify-center gap-x-2'>
							<Icon name='Inbox' className='size-6' strokeWidth={1.25} />
							{t('ns_common:table.no_data')}
						</Typography>
					</Div>
				)}
			</Div>
		</Div>
	)
}

export default RFIDDeviceList
