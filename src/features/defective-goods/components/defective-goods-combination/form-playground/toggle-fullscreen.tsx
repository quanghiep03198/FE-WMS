import { Button, Icon, Label, Switch } from '@components/ui'
import useMediaQuery from '@hooks/use-media-query'
import { useFullscreen, useKeyPress, useUnmount } from 'ahooks'
import React, { memo } from 'react'

import { useTranslation } from 'react-i18next'

const ToggleFullscreen: React.FC = () => {
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const [isFullscreen, { exitFullscreen, toggleFullscreen }] = useFullscreen(document.body)
	const { t } = useTranslation()

	useKeyPress('F11', (e) => {
		e.preventDefault()
		toggleFullscreen()
	})

	useUnmount(() => {
		exitFullscreen()
	})

	if (isMobile)
		return (
			<Button
				className='aria-pressed:text-foreground h-8 rounded-md px-3 text-xs'
				size='sm'
				type='button'
				variant='ghost'
				onClick={() => toggleFullscreen()}>
				<Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={14} />
				{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}
			</Button>
		)

	return (
		<Label className='inline-flex items-center gap-x-2' htmlFor='toggle-fullscreen'>
			<Icon name='Fullscreen' size={18} />
			{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}
			<Switch checked={isFullscreen} id='toggle-fullscreen' onCheckedChange={() => toggleFullscreen()} />
		</Label>
	)
}

export default memo(ToggleFullscreen)
