import { Div, Label, Switch, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

import { useLayoutEffect, useState } from 'react'

const SettingPanel: React.FC = () => {
	const { t } = useTranslation()
	const [fullScreen, setFullScreen] = useState<boolean>(false)

	useLayoutEffect(() => {
		if (fullScreen && !document.fullscreenElement) document.documentElement.requestFullscreen()
		else if (!fullScreen && document.fullscreenElement) document.exitFullscreen()
	}, [fullScreen, document.fullscreenElement])

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_common:titles.general_settings')}
			</Typography>
			<Div className='flex h-full flex-col items-stretch gap-x-4 gap-y-2 *:flex-1 @5xl:flex-row @5xl:flex-wrap-reverse'>
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
							checked={fullScreen}
							onCheckedChange={(value) => setFullScreen(Boolean(value))}
						/>
					</SwitchBox.InnerWrapper>
				</SwitchBox.Wrapper>
			</Div>
		</Div>
	)
}

const SwitchBox = {
	Wrapper: tw.div`grid grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0 z-0 min-h-28`,
	TitleWrapper: tw.div`col-span-full space-y-1 @[320px]:col-span-3`,
	InnerWrapper: tw.div`col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end`
}

export default SettingPanel
