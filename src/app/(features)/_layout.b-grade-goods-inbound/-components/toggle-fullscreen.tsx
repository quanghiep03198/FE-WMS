import { Div, Label, Switch } from '@/components/ui'
import { useFullscreen } from 'ahooks'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const ToggleFullscreen: React.FC = () => {
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)
	const { t } = useTranslation()

	return (
		<Div className='inline-flex items-center gap-x-2'>
			<Label htmlFor='toggle-fullscreen'>{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}</Label>
			<Switch id='toggle-fullscreen' checked={isFullscreen} onCheckedChange={() => toggleFullscreen()} />
		</Div>
	)
}

export default memo(ToggleFullscreen)
