import { Div, Label, Switch, Typography } from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { RFIDSettings } from '../..'
import { PM_RFID_SETTINGS_KEY } from '../../_constants/index.const'

/**
 * @description Toggle fullscreen mode setting
 */
const FullscreenSwitch: React.FC = () => {
	const { t } = useTranslation()
	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(PM_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	return (
		<Div className='grid min-h-40 grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:min-h-28 @[320px]:gap-0'>
			<Div className='col-span-full space-y-1 @[320px]:col-span-3'>
				<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:scanner_setting.toggle_fullscreen_note')}
				</Typography>
			</Div>
			<Div className='col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end'>
				<Switch
					id='toggle-fullscreen'
					className='max-w-full'
					checked={Boolean(settings?.fullscreenMode)}
					onCheckedChange={(value) => setSettings({ ...settings, fullscreenMode: Boolean(value) })}
				/>
			</Div>
		</Div>
	)
}

export default FullscreenSwitch
