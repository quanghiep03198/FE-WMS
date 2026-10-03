import { Div, Label, Switch, Typography } from '@components/ui'
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
		<Div className='grid w-full grid-cols-[3fr_1fr] items-center rounded-md border p-4'>
			<Div className='space-y-1'>
				<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
				<Typography className='block text-pretty' color='muted' variant='small'>
					{t('ns_inoutbound:scanner_setting.toggle_fullscreen_note')}
				</Typography>
			</Div>
			<Div className='place-self-center justify-self-end'>
				<Switch
					checked={isFullscreen}
					className='max-w-full'
					id='toggle-fullscreen'
					onCheckedChange={() => toggleFullscreen()}
				/>
			</Div>
		</Div>
	)
}

export default FullscreenToggleBox
