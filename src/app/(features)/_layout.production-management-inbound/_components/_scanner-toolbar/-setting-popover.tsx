import { cn } from '@/common/utils/cn'
import {
	Badge,
	buttonVariants,
	Div,
	Icon,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Slider,
	Switch,
	Typography
} from '@/components/ui'
import { useLocalStorageState } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { DEFAULT_PM_RFID_SETTINGS, RFIDSettings } from '../..'
import { PM_RFID_SETTINGS_KEY } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'

const SettingPopover: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Popover>
			<PopoverTrigger
				className={cn(buttonVariants({ variant: 'secondary', size: 'icon', className: 'aspect-square' }))}>
				<Icon name='Settings' />
			</PopoverTrigger>
			<PopoverContent side='bottom' align='end' className='w-[28rem] space-y-4 @container'>
				<Div className='space-y-1'>
					<Typography variant='h6' className='text-lg'>
						{t('ns_common:navigation.settings')}
					</Typography>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:scanner_setting.adjust_setting_description')}
					</Typography>
				</Div>
				<PollingIntervalSelector />
				<FullscreenSwitch />
			</PopoverContent>
		</Popover>
	)
}

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

export default SettingPopover
