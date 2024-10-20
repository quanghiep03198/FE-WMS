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
import { HoverCardPortal } from '@radix-ui/react-hover-card'
import { useLocalStorageState, useSessionStorageState } from 'ahooks'
import { debounce, pick } from 'lodash'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../_contexts/-page-context'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='basis-1/2 space-y-4'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				{t('ns_common:actions.adjust')}
			</Typography>
			<Div className='flex h-full flex-1 flex-col gap-y-4'>
				<PollingIntervalSelector />
				<FullScreenModeSwitch />
				<DeveloperModeSwitch />
			</Div>
		</Div>
	)
}

const PollingIntervalSelector: React.FC = () => {
	const { t } = useTranslation()
	const { scanningStatus, pollingDuration, setPollingDuration } = usePageContext((state) =>
		pick(state, ['scanningStatus', 'pollingDuration', 'setPollingDuration'])
	)

	const disabled = scanningStatus === 'connected' || scanningStatus === 'connecting'

	return (
		<HoverCard openDelay={50} closeDelay={50}>
			<HoverCardTrigger asChild>
				<Div className='grid gap-2'>
					<Div className='flex items-center justify-between'>
						<Label htmlFor='polling-duration'>{t('ns_inoutbound:rfid_toolbox.polling_duration')}</Label>
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
							step={100}
							defaultValue={[pollingDuration]}
							disabled={disabled}
							onValueChange={debounce((value) => setPollingDuration(value[0]), 500)}
							className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
							aria-label='Polling Duration'
						/>
						<Icon name='Leaf' size={20} />
					</Div>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:rfid_toolbox.polling_duration_note')}
					</Typography>
				</Div>
			</HoverCardTrigger>
			<HoverCardPortal>
				<HoverCardContent className='z-50 w-64 text-sm' side='left' align='start' sideOffset={8}>
					{t('ns_inoutbound:rfid_toolbox.polling_duration_description')}
				</HoverCardContent>
			</HoverCardPortal>
		</HoverCard>
	)
}

const FullScreenModeSwitch: React.FC = () => {
	const { t } = useTranslation()
	const [isFullScreen, setFullScreen] = useSessionStorageState<boolean>('isFullScreen', {
		listenStorageChange: true,
		defaultValue: false
	})

	return (
		<SwitchBox.Wrapper>
			<SwitchBox.TitleWrapper>
				<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:rfid_toolbox.toggle_fullscreen')}</Label>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:rfid_toolbox.toggle_fullscreen_note')}
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

const DeveloperModeSwitch: React.FC = () => {
	const { t } = useTranslation()
	const [isEnableDeveloperMode, setDeveloperMode] = useLocalStorageState<boolean>('enableDeveloperMode', {
		listenStorageChange: true
	})

	return (
		<SwitchBox.Wrapper>
			<SwitchBox.TitleWrapper>
				<Label htmlFor='toggle-developer-mode'>{t('ns_inoutbound:rfid_toolbox.developer_mode')}</Label>
				<Typography variant='small' color='muted'>
					{t('ns_inoutbound:rfid_toolbox.developer_mode_note')}
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
	Wrapper: tw.div`grid min-h-36 grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:min-h-28 @[320px]:gap-0`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
