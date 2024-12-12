import {
	Badge,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
	Slider,
	Switch,
	Typography
} from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import { usePageContext } from '../../_contexts/-page-context'
import { DEFAULT_FP_RFID_SETTINGS, RFIDSettings } from '../../index.lazy'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='basis-1/2 space-y-4'>
			<Typography variant='h6' className='px-4 text-lg sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='flex h-full flex-1 flex-col gap-y-4 overflow-y-auto px-4 scrollbar xl:max-h-96 xxl:max-h-none'>
				<PollingIntervalSelector />
				<FullScreenModeSwitch />
				<DeveloperModeSwitch />
			</Div>
		</Div>
	)
}

/**
 * @description Adjust polling duration for SSE
 */
const PollingIntervalSelector: React.FC = () => {
	const { t } = useTranslation()
	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	const { scanningStatus } = usePageContext('scanningStatus')

	const disabled = scanningStatus === 'connected' || scanningStatus === 'connecting'

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_FP_RFID_SETTINGS.pollingDuration

	return (
		<HoverCard openDelay={50} closeDelay={50}>
			<HoverCardTrigger asChild>
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
							max={5000}
							step={100}
							defaultValue={[settings?.pollingDuration ?? DEFAULT_FP_RFID_SETTINGS.pollingDuration]}
							disabled={disabled}
							onValueChange={(value) => setSettings({ ...settings, pollingDuration: value[0] })}
							className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
							aria-label='Polling Duration'
						/>
						<Icon name='Leaf' size={20} />
					</Div>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:scanner_setting.polling_duration_note')}
					</Typography>
				</Div>
			</HoverCardTrigger>
			<HoverCardContent className='z-50 w-64 text-sm' side='top' align='end'>
				{t('ns_inoutbound:scanner_setting.polling_duration_description')}
			</HoverCardContent>
		</HoverCard>
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
				<Typography variant='small' color='muted'>
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
				<Typography variant='small' color='muted'>
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
	Wrapper: tw.div`grid min-h-40 grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:min-h-28 @[320px]:gap-0`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
