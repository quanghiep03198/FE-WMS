import { Div, HoverCard, HoverCardContent, HoverCardTrigger, Label, Slider, Switch, Typography } from '@/components/ui'
import { SliderProps } from '@radix-ui/react-slider'
import { useSessionStorageState } from 'ahooks'
import { pick } from 'lodash'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../_contexts/-page-context'

const SettingPanel: React.FC = () => {
	const [isEnablePreserveLog, setEnablePreserveLog] = useSessionStorageState<boolean>('rfidPreserveLog', {
		listenStorageChange: true
	})

	return (
		<Div className='basis-1/2 space-y-4'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				Settings
			</Typography>
			<Div className='flex h-full flex-1 flex-col gap-y-4 @container-normal'>
				<PollingIntervalSelector defaultValue={[0.5]} />
				{/*  */}
				<Div className='grid grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0'>
					<Div className='col-span-full space-y-1.5 @[320px]:col-span-3'>
						<Label htmlFor='toggle-fullscreen'>Toggle full screen</Label>
						<Typography variant='small' color='muted'>
							Use full screen mode to have larger view
						</Typography>
					</Div>
					<Div className='col-span-full place-content-end @[320px]:col-span-1 @[320px]:grid'>
						<Switch id='toggle-fullscreen' className='max-w-full' />
					</Div>
				</Div>
				{/*  */}
				<Div className='grid grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0'>
					<Div className='col-span-full space-y-1.5 @[320px]:col-span-3'>
						<Label htmlFor='toggle-preserve-log'>Preserve log</Label>
						<Typography variant='small' color='muted'>
							Do not clear log on reset
						</Typography>
					</Div>
					<Div className='col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end'>
						<Switch
							id='toggle-preserve-log'
							checked={isEnablePreserveLog}
							className='max-w-full'
							onCheckedChange={(value) => setEnablePreserveLog(value)}
						/>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

interface PollingIntervalSelectorProps {
	defaultValue: SliderProps['defaultValue']
}

const PollingIntervalSelector: React.FC<PollingIntervalSelectorProps> = ({ defaultValue }) => {
	const { pollingDuration, setPollingDuration } = usePageContext((state) =>
		pick(state, ['pollingDuration', 'setPollingDuration'])
	)

	return (
		<Div className='z-50 mb-6 grid gap-2 pt-2'>
			<HoverCard openDelay={0}>
				<HoverCardTrigger asChild>
					<Div className='grid gap-4'>
						<Div className='flex items-center justify-between'>
							<Label htmlFor='temperature'>Polling duration</Label>
							<span className='rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border'>
								{pollingDuration / 1000 >= 1 ? `${pollingDuration / 1000} s` : `${pollingDuration} ms`}
							</span>
						</Div>
						<Slider
							id='temperature'
							max={1}
							defaultValue={[pollingDuration]}
							step={0.25}
							onValueChange={(value) => setPollingDuration(value[0])}
							className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4'
							aria-label='Temperature'
						/>
					</Div>
				</HoverCardTrigger>
				<HoverCardContent align='start' className='z-50 w-64 text-sm' side='top'>
					Controls polling duration: lower value means faster polling however it can cause higher traffic for
					server
				</HoverCardContent>
			</HoverCard>
		</Div>
	)
}

const SwitchWrapper = tw

export default SettingPanel
