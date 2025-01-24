import { Div, Label, Switch, Typography } from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import { RFIDSettings } from '../../index.lazy'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography variant='h6' className='inline-flex items-center gap-x-2 text-lg sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='flex h-full flex-col items-stretch gap-x-4 gap-y-2 *:flex-1 @5xl:flex-row @5xl:flex-wrap-reverse'>
				<FullScreenModeSwitch />
				<DeveloperModeSwitch />
			</Div>
		</Div>
	)
}

/**
 * @description Toggle fullscreen mode setting
 */
const FullScreenModeSwitch: React.FC = () => {
	const { t } = useTranslation()
	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})
	return (
		<SwitchBox.Wrapper>
			<SwitchBox.TitleWrapper>
				<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
				<Typography variant='small' color='muted' className='text-pretty'>
					{t('ns_inoutbound:scanner_setting.toggle_fullscreen_note')}
				</Typography>
			</SwitchBox.TitleWrapper>
			<SwitchBox.InnerWrapper>
				<Switch
					id='toggle-fullscreen'
					className='max-w-full'
					checked={settings?.fullscreenMode}
					onCheckedChange={(value) => setSettings({ ...settings, fullscreenMode: Boolean(value) })}
				/>
			</SwitchBox.InnerWrapper>
		</SwitchBox.Wrapper>
	)
}

/**
 * @description Toggle developer mode setting
 */
const DeveloperModeSwitch: React.FC = () => {
	const { t } = useTranslation()
	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	return (
		<SwitchBox.Wrapper>
			<SwitchBox.TitleWrapper>
				<Label htmlFor='toggle-developer-mode'>{t('ns_inoutbound:scanner_setting.developer_mode')}</Label>
				<Typography variant='small' color='muted' className='text-pretty'>
					{t('ns_inoutbound:scanner_setting.developer_mode_note')}
				</Typography>
			</SwitchBox.TitleWrapper>
			<SwitchBox.InnerWrapper>
				<Switch
					id='toggle-developer-mode'
					checked={settings?.developerMode}
					className='max-w-full'
					onCheckedChange={(value) => setSettings({ ...settings, developerMode: Boolean(value) })}
				/>
			</SwitchBox.InnerWrapper>
		</SwitchBox.Wrapper>
	)
}

const SwitchBox = {
	Wrapper: tw.div`grid grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0 z-0 min-h-28`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
