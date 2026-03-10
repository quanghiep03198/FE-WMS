import { Div, Label, Switch, Typography } from '@/components/ui'
import { useFullscreen, useKeyPress, useUnmount } from 'ahooks'
import { useTranslation } from 'react-i18next'

const FullscreenToggleBox: React.FC<{ shouldExitOnUnmount?: boolean }> = ({ shouldExitOnUnmount = true }) => {
	const { t } = useTranslation()
	const [isFullscreen, { toggleFullscreen, exitFullscreen }] = useFullscreen(document.body)

	useKeyPress('F11', (e) => {
		e.preventDefault()
		toggleFullscreen()
	})

	useUnmount(() => {
		if (shouldExitOnUnmount) exitFullscreen()
	})

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='grid w-full grid-cols-[3fr_1fr] items-center rounded-md border p-4'>
				<Div className='space-y-1'>
					<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
					<Typography variant='small' color='muted' className='block text-pretty'>
						{t('ns_inoutbound:scanner_setting.toggle_fullscreen_note')}
					</Typography>
				</Div>
				<Div className='place-self-center justify-self-end'>
					<Switch
						id='toggle-fullscreen'
						className='max-w-full'
						checked={isFullscreen}
						onCheckedChange={() => toggleFullscreen()}
					/>
				</Div>
			</Div>
		</Div>
	)
}

export default FullscreenToggleBox
