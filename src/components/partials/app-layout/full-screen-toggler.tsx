import type { ButtonProps } from '@components/ui/button'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { useFullscreen } from 'ahooks'
import React from 'react'

const FullScreenToggler: React.FC<ButtonProps> = (props) => {
	const [isFullScreen, { enterFullscreen, exitFullscreen }] = useFullscreen(document.body, {})

	return (
		<Button
			size='icon'
			variant={isFullScreen ? 'secondary' : 'ghost'}
			onClick={() => {
				if (isFullScreen) exitFullscreen()
				enterFullscreen()
			}}
			{...props}>
			<Icon name='Fullscreen' />
		</Button>
	)
}

export default FullScreenToggler
