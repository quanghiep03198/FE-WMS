import { detectBrowser } from '@/common/utils/browser'
import { cn } from '@/common/utils/cn'
import { Icon, Typography } from '@/components/ui'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
	className?: string
	hasGlow?: boolean
}

const MQTTVisual: React.FC<Props> = ({ className, hasGlow = false }) => {
	const containerRef = useRef(null)
	const ref = useRef(null)
	const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 })
	const isSafari = typeof window !== 'undefined' && detectBrowser() === 'Safari'

	const handleGlow = (event: any) => {
		if (!ref.current || !containerRef.current) return null

		const containerRefElement = containerRef.current as HTMLDivElement

		const {
			x: contX,
			y: contY,
			width: containerWidth,
			height: containerHeight
		} = containerRefElement.getBoundingClientRect()
		const xCont = event.clientX - contX
		const yCont = event.clientY - contY

		// const isContainerHovered = xCont > -3 && xCont < containerWidth + 3 && yCont > -3 && yCont < containerHeight + 3

		// if (!isContainerHovered) return

		const svgElement = ref.current as SVGElement
		const { x: svgX, y: svgY } = svgElement.getBoundingClientRect()
		const x = event.clientX - svgX
		const y = event.clientY - svgY
		console.log('{x, y} :>> ', { x, y })
		setGradientPos({ x, y })
	}

	useEffect(() => {
		// if (typeof window === 'undefined' || isSafari) return

		window.addEventListener('mousemove', handleGlow)
		return () => {
			window.removeEventListener('mousemove', handleGlow)
		}
	}, [])

	const gradientTransform = `translate(${gradientPos?.x / 9} ${gradientPos?.y / 9}) scale(5 5)`

	return (
		<div className='row-span-2 flex flex-col gap-y-6 rounded-lg border'>
			<div className='space-y-2 p-4'>
				<Typography as='h5' className='inline-flex items-center gap-x-2 text-lg font-medium'>
					<Icon name='Blocks' size={18} /> Integration
				</Typography>
				<Typography>
					Eclipse Mosquitto Integration <br />
					<span className='text-muted-foreground'>suitable for Internet of Things messaging</span>
				</Typography>
			</div>
			<div
				className='relative mx-auto h-full w-full max-w-44 flex-1 place-content-center place-items-center overflow-hidden'
				ref={containerRef}>
				<figure
					className={cn('absolute inset-0 z-0 w-full place-content-center place-items-center', className)}
					role='img'
					aria-label='Eclipse Mosquitto visual composition'>
					<svg
						ref={ref}
						fill='none'
						viewBox='0 0 24 24'
						role='img'
						strokeWidth={0.2}
						className='z-0 mx-auto object-center antialiased transition-opacity'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							stroke='url(#a)'
							strokeWidth={0.2}
							d='M1.353 11.424c0 2.637.964 5.105 2.636 7.013l-1.007.903A11.968 11.968 0 010 11.424C0 8.065 1.38 5.029 3.604 2.85l.05.045L6.637 5.57a7.942 7.942 0 00-1.433 9.963l1.03-.923a6.59 6.59 0 011.416-8.132l1.02.915.909.814.941.844a2.778 2.778 0 00-1.311 2.367c0 1.23.795 2.273 1.899 2.646l.095 1.297a4.024 4.024 0 01-2.483-6.27l-.9-.809-.004-.003a5.233 5.233 0 00.205 6.546l-3.023 2.71a9.291 9.291 0 01-.21-11.97L3.777 4.66a10.599 10.599 0 00-2.407 6.14l-.006.008.005.004c-.011.203-.017.406-.017.612zm11.54 2.639a2.793 2.793 0 00.588-5.013l.941-.844.908-.814 1.021-.915a6.59 6.59 0 011.417 8.132l1.029.923a7.942 7.942 0 00-1.433-9.963l2.981-2.673.05-.045A11.964 11.964 0 0124 11.424c0 2.98-1.095 5.769-2.982 7.916l-1.007-.903a10.61 10.61 0 002.619-7.625l.005-.004-.006-.007a10.598 10.598 0 00-2.407-6.141l-1.008.904a9.291 9.291 0 01-.211 11.97l-3.023-2.71a5.233 5.233 0 00.205-6.546l-.004.003-.9.808a4.024 4.024 0 01-2.482 6.27zM12 21.149l.335-4.571.271-3.712a1.56 1.56 0 10-1.212 0l.271 3.712Z'
						/>
						<defs>
							<radialGradient
								id='a'
								cx='1'
								cy='1'
								r='3'
								gradientUnits='userSpaceOnUse'
								gradientTransform={gradientTransform}>
								<stop stopColor='hsl(var(--success)/80%)' />
								<stop offset='1' stopColor='hsl(var(--border))' />
							</radialGradient>
						</defs>
					</svg>
				</figure>
			</div>
		</div>
	)
}

export default MQTTVisual
