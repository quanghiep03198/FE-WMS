import { Button, ButtonProps, Icon } from '@/components/ui'
import { useFullscreen } from 'ahooks'
import React from 'react'

const FullScreenToggler: React.FC<ButtonProps> = (props) => {
	const [isFullScreen, { enterFullscreen, exitFullscreen }] = useFullscreen(document.body, {})

	return (
		<Button
			variant={isFullScreen ? 'secondary' : 'ghost'}
			size='icon'
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
