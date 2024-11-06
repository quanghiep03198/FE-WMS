import {
	Badge,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
	Separator,
	Slider,
	Switch,
	Typography
} from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

import { RFIDSettings } from '@/app/(features)/_layout.finished-production-inoutbound/_constants/rfid.const'
import { usePageContext } from '../../_contexts/-page-context'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='h-full space-y-4 rounded-lg border p-4'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='flex flex-col gap-2'>
				{/* <PollingIntervalSelector /> */}
				<div className='basis-1/2'>
					<FullScreenModeSwitch />
				</div>
				<Separator orientation='vertical' />
				<div className='basis-1/2'>
					<DeveloperModeSwitch />
				</div>
			</Div>
		</Div>
	)
}

/**
 * @description Adjust polling duration for SSE
 */
const PollingIntervalSelector: React.FC = () => {
	const { t } = useTranslation()
	const [pollingDuration, setPollingDuration] = useLocalStorageState<number>(RFIDSettings.SSE_POLLING_DURATION, {
		defaultValue: 750,
		listenStorageChange: true
	})
	const { scanningStatus } = usePageContext('scanningStatus')

	const disabled = scanningStatus === 'connected' || scanningStatus === 'connecting'

	return (
		<HoverCard openDelay={50} closeDelay={50}>
			<HoverCardTrigger asChild>
				<Div className='grid gap-2'>
					<Div className='flex items-center justify-between'>
						<Label htmlFor='polling-duration'>{t('ns_inoutbound:scanner_setting.polling_duration')}</Label>
						<Badge variant='outline'>
							{+pollingDuration / 1000 >= 1 ? `${+pollingDuration / 1000} s` : `${+pollingDuration} ms`}
						</Badge>
					</Div>
					<Div className='flex items-center gap-x-3'>
						<Icon name='Zap' size={20} />
						<Slider
							id='polling-duration'
							min={500}
							max={1000}
							step={50}
							defaultValue={[+pollingDuration]}
							disabled={disabled}
							onValueChange={(value) => setPollingDuration(value[0])}
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
			<HoverCardContent className='z-50 w-64 text-sm' side='left' align='start' sideOffset={8}>
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
	const [isFullScreen, setFullScreen] = useLocalStorageState<boolean>(RFIDSettings.FULLSCREEN_MODE, {
		listenStorageChange: true,
		defaultValue: false
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
					checked={isFullScreen}
					onCheckedChange={setFullScreen}
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
	const [isEnableDeveloperMode, setDeveloperMode] = useLocalStorageState<boolean>(RFIDSettings.DEVELOPER_MODE, {
		defaultValue: false,
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
					checked={isEnableDeveloperMode}
					className='max-w-full'
					onCheckedChange={(value) => setDeveloperMode(value)}
				/>
			</SwitchBox.InnerWrapper>
		</SwitchBox.Wrapper>
	)
}

const SwitchBox = {
	Wrapper: tw.div`grid grid-cols-4 items-center gap-y-6`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
