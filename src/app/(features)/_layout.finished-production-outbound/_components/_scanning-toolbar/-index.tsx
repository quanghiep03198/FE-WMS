import { Button, Div, Icon, Toggle } from '@/components/ui'
import { useEffect, useState } from 'react'

const ScanningFloatToolbar: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false)
	const [isFullScreen, setIsFullScreen] = useState(false)

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			const { clientY } = event
			const threshold = window.innerHeight - 100
			setIsVisible(clientY > threshold)
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	if (!isVisible) {
		return null
	}

	return (
		<Div
			data-visible={isVisible}
			className='data-[visible=false]:animate-fade-out fixed bottom-10 left-1/2 flex w-fit translate-y-2 items-center justify-around gap-x-2 rounded-l-full rounded-r-full border bg-popover p-1 shadow duration-500 data-[visible=true]:animate-fade-in'>
			<Button
				size='icon'
				variant='ghost'
				className='size-8 rounded-full'
				onClick={() => window.dispatchEvent(new CustomEvent('refetchSSE'))}>
				<Icon name='RotateCw' />
			</Button>
			<Toggle
				className='size-8 rounded-full'
				pressed={isFullScreen}
				onPressedChange={(pressed) => {
					setIsFullScreen(pressed)
					if (pressed && !document?.fullscreenElement) document.documentElement.requestFullscreen()
					else document.exitFullscreen()
				}}>
				<Icon name={isFullScreen ? 'Shrink' : 'Fullscreen'} className='min-w-8' />
			</Toggle>
		</Div>
	)
}

export default ScanningFloatToolbar
