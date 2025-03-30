import { Button, Div, Icon, Toggle } from '@/components/ui'
import { useFullscreen } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ScanningFloatToolbar: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false)
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body)
	const { t } = useTranslation()

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
		isVisible && (
			<Div className='absolute bottom-8 left-1/2 w-fit -translate-x-1/2'>
				<Div
					data-visible={isVisible}
					className='grid w-fit grid-cols-2 items-center justify-around gap-x-1 rounded-l-full rounded-r-full border bg-popover p-1 shadow-xl transition-opacity duration-500 data-[visible=false]:animate-fade-out data-[visible=true]:animate-fade-in'>
					<Button
						variant='ghost'
						className='rounded-l-full rounded-r-full'
						onClick={() => window.dispatchEvent(new CustomEvent('refetchSSE'))}>
						<Icon name='RotateCw' role='img' />
						{t('ns_common:actions.reload')}
					</Button>

					<Toggle
						className='gap-x-2 rounded-l-full rounded-r-full hover:text-foreground'
						pressed={isFullscreen}
						onPressedChange={() => toggleFullscreen()}>
						<Icon name={isFullscreen ? 'Shrink' : 'Fullscreen'} role='img' />
						{t('ns_inoutbound:scanner_setting.toggle_fullscreen')}
					</Toggle>
				</Div>
			</Div>
		)
	)
}

export default ScanningFloatToolbar
