import { Icon, Label, Switch } from '@/components/ui'
import { useFullscreen, useKeyPress, useUnmount } from 'ahooks'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const ToggleFullscreen: React.FC = () => {
	const [isFullscreen, { exitFullscreen, toggleFullscreen }] = useFullscreen(document.body)
	const { t } = useTranslation()

	useKeyPress('F11', (e) => {
		e.preventDefault()
		toggleFullscreen()
	})

	useUnmount(() => {
		exitFullscreen()
	})

	return (
		<Label htmlFor='toggle-fullscreen' className='inline-flex items-center gap-x-2'>
			<Icon name='Fullscreen' size={18} />
			{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}
			<Switch id='toggle-fullscreen' checked={isFullscreen} onCheckedChange={() => toggleFullscreen()} />
		</Label>
	)
}

export default memo(ToggleFullscreen)
