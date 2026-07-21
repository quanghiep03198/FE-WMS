import { Div, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from '@/components/ui'
import { Languages, RecordStatus } from '@common/constants/enums'
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
		return data.filter((device) => device.is_active === RecordStatus.ACTIVE && device.station_no.endsWith('WH101'))
	}, [data])

	return (
		<Select
			value={selectedDevice ?? ''}
			onValueChange={(value) => {
				setSelectedDevice(value)
				handleResetScanningAction()
			}}>
			<SelectTrigger className='h-9 items-center gap-x-2 rounded-md border px-3 py-2 @[1366px]:flex sm:hidden'>
				<SelectValue placeholder={t('ns_inoutbound:placeholders.select_rfid_device')} />
			</SelectTrigger>
			<SelectContent>
				{inboundDevices.map((device) => {
					const deviceNameLocalization = {
						[Languages.VIETNAMESE]: device.device_name_vi,
						[Languages.ENGLISH]: device.device_name_en,
						[Languages.CHINESE]: device.device_name_cn
					}
					return (
						<SelectItem key={device.device_sn} value={device.device_sn}>
							<Div className='flex items-center gap-2'>
								<Icon
									name={isNil(device.device_ant) || device.device_ant === '0' ? 'SmartphoneNfc' : 'Router'}
								/>
								{deviceNameLocalization[i18n.language] ?? (
									<Div className='text-sm text-muted-foreground'>{t('ns_common:titles.unknown')}</Div>
								)}
								<Typography variant='small' color='muted'>
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
