import { Badge, Div, Icon, Label, Slider, Typography } from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_PM_RFID_SETTINGS, RFIDSettings } from '../..'
import { PM_RFID_SETTINGS_KEY } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'

/**
 * @description Adjust polling duration for SSE
 */
const PollingIntervalSelector: React.FC = () => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')
	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(PM_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	const disabled = scanningStatus === 'connected' || scanningStatus === 'connecting'

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_PM_RFID_SETTINGS.pollingDuration

	return (
		<Div className='grid gap-2'>
			<Div className='flex items-center justify-between'>
				<Label htmlFor='polling-duration'>{t('ns_inoutbound:scanner_setting.polling_duration')}</Label>
				<Badge variant='outline'>
					{pollingDuration / 1000 >= 1 ? `${pollingDuration / 1000} s` : `${pollingDuration} ms`}
				</Badge>
			</Div>
			<Div className='flex items-center gap-x-3'>
				<Icon name='Zap' size={20} />
				<Slider
					id='polling-duration'
					min={500}
					max={1000}
					step={50}
					defaultValue={[pollingDuration]}
					disabled={disabled}
					onValueChange={(value) => setSettings({ ...settings, pollingDuration: value[0] })}
					className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
					aria-label='Polling Duration'
				/>
				<Icon name='Leaf' size={20} />
			</Div>
			<Typography variant='small' color='muted'>
				{t('ns_inoutbound:scanner_setting.polling_duration_description')}
			</Typography>
		</Div>
	)
}

export default PollingIntervalSelector
