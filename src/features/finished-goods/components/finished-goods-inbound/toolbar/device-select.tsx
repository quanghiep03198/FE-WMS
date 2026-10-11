import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { useGetRFIDDeviceQuery } from '@features/rfid-device/hooks/use-rfid-device-request'
import { useQueryClient } from '@tanstack/react-query'
import { isNil } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'
import { FinishedGoodsInboundQueryKeys } from '../../../hooks/use-inbound-request'

const DeviceSelect: React.FC = () => {
	const { t, i18n } = useTranslation()

	const { data } = useGetRFIDDeviceQuery()
	const {
		selectedDevice,
		setSelectedDevice,
		reset: resetScanningAction
	} = usePageContext('selectedDevice', 'setSelectedDevice', 'reset')
	const queryClient = useQueryClient()

	const handleResetScanningAction = () => {
		queryClient.removeQueries({
			queryKey: [FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_MO],
			exact: false,
			type: 'all'
		})
		queryClient.removeQueries({
			queryKey: [FinishedGoodsInboundQueryKeys.SCANNING_INBOUND_EPCS],
			exact: false,
			type: 'all'
		})
		resetScanningAction()
	}

	const inboundDevices = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((device) => device.station_no.endsWith('WH101'))
	}, [data])

	return (
		<Select
			value={selectedDevice ?? ''}
			onValueChange={(value) => {
				setSelectedDevice(value)
				handleResetScanningAction()
			}}>
			<SelectTrigger className='h-9 max-w-full items-center gap-x-2 rounded-md border px-3 py-2 shadow-none sm:hidden @[1366px]:flex'>
				<SelectValue className='truncate' placeholder={t('ns_inoutbound:placeholders.select_rfid_device')} />
			</SelectTrigger>
			<SelectContent>
				{inboundDevices.map((device) => {
					return (
						<SelectItem key={device.device_sn} value={device.device_sn}>
							<Div className='flex items-center gap-2'>
								<Icon
									name={isNil(device.device_ant) || device.device_ant === '0' ? 'SmartphoneNfc' : 'Router'}
								/>
								{device.device_name[i18n.language] ?? (
									<Div className='text-muted-foreground text-sm'>{t('ns_common:titles.unknown')}</Div>
								)}
								<Typography color='muted' variant='small'>
									({device.device_sn})
								</Typography>
							</Div>
						</SelectItem>
					)
				})}
			</SelectContent>
		</Select>
	)
}

export default DeviceSelect
