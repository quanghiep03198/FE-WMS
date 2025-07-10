import { Div, Label, Switch, Typography } from '@/components/ui'
import { useFullscreen } from 'ahooks'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='flex h-full flex-col items-stretch gap-x-4 gap-y-2 *:flex-1 @5xl:flex-row @5xl:flex-wrap-reverse'>
				<SwitchBox.Wrapper>
					<SwitchBox.TitleWrapper>
						<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
						<Typography variant='small' color='muted' className='block text-pretty'>
							{t('ns_inoutbound:scanner_setting.toggle_fullscreen_note')}
						</Typography>
					</SwitchBox.TitleWrapper>
					<SwitchBox.InnerWrapper>
						<Switch
							id='toggle-fullscreen'
							className='max-w-full'
							checked={isFullscreen}
							onCheckedChange={() => toggleFullscreen()}
						/>
					</SwitchBox.InnerWrapper>
				</SwitchBox.Wrapper>
			</Div>
		</Div>
	)
}

const SwitchBox = {
	Wrapper: tw.div`grid grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0 z-0 min-h-24`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
