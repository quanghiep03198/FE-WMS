import { Div, Label, Switch, Typography } from '@/components/ui'
import { useFullscreen } from 'ahooks'
import { useTranslation } from 'react-i18next'

const FullscreenToggleBox: React.FC = () => {
	const { t } = useTranslation()
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)

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
