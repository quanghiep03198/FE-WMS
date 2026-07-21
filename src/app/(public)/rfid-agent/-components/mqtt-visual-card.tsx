import { Badge, Icon } from '@/components/ui'
import { Theme } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import useTheme from '@hooks/use-theme'
import { useEventListener } from 'ahooks'
import React, { cloneElement, useRef, useState } from 'react'
import { VisualCard } from './visual-card'

interface Props {
	className?: string
	hasGlow?: boolean
}

const MQTTVisualCard: React.FC<Props> = ({ className }) => {
	const containerRef = useRef(null)
	const ref = useRef(null)
	const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 })
	const { theme } = useTheme()

	const handleGlow = (event: React.MouseEvent) => {
		if (!ref.current || !containerRef.current) return null
		const svgElement = ref.current as SVGElement
		const { x: svgX, y: svgY } = svgElement.getBoundingClientRect()
		const x = event.clientX - svgX
		const y = event.clientY - svgY
		setGradientPos({ x, y })
	}

	useEventListener('mousemove', handleGlow, { target: window, capture: true })

	const gradientTransform = /* CSS */ `translate(${gradientPos?.x / 10} ${gradientPos?.y / 10}) scale(2.5 2.5)`

	return (
		<VisualCard.Wrapper className='h-full'>
			<VisualCard.Header>
				<VisualCard.Title>
					<Icon name='Blocks' /> IoT Solution
				</VisualCard.Title>
				<VisualCard.Description>
					<span className='text-foreground'>Eclipse Mosquitto Integration</span> <br />
					suitable for Internet of Things messaging
				</VisualCard.Description>
			</VisualCard.Header>
			<VisualCard.Content
				ref={containerRef}
				className='md:grid md:grid-cols-[1fr_2fr] md:gap-6 md:px-6 @md/visual-card:px-6'>
				<figure
					className={cn('z-0 grid place-items-center', className)}
					role='img'
					aria-label='Eclipse Mosquitto visual composition'>
					<svg
						ref={ref}
						viewBox='0 0 24 24'
						role='img'
						fill='none'
						className='w-full max-w-40 md:max-w-48'
						strokeWidth={0.2}
						xmlns='http://www.w3.org/2000/svg'>
						<title>{'Eclipse Mosquitto icon'}</title>
						<path
							stroke='url(#glow)'
							d='M1.353 11.424c0 2.637.964 5.105 2.636 7.013l-1.007.903A11.968 11.968 0 010 11.424C0 8.065 1.38 5.029 3.604 2.85l.05.045L6.637 5.57a7.942 7.942 0 00-1.433 9.963l1.03-.923a6.59 6.59 0 011.416-8.132l1.02.915.909.814.941.844a2.778 2.778 0 00-1.311 2.367c0 1.23.795 2.273 1.899 2.646l.095 1.297a4.024 4.024 0 01-2.483-6.27l-.9-.809-.004-.003a5.233 5.233 0 00.205 6.546l-3.023 2.71a9.291 9.291 0 01-.21-11.97L3.777 4.66a10.599 10.599 0 00-2.407 6.14l-.006.008.005.004c-.011.203-.017.406-.017.612zm11.54 2.639a2.793 2.793 0 00.588-5.013l.941-.844.908-.814 1.021-.915a6.59 6.59 0 011.417 8.132l1.029.923a7.942 7.942 0 00-1.433-9.963l2.981-2.673.05-.045A11.964 11.964 0 0124 11.424c0 2.98-1.095 5.769-2.982 7.916l-1.007-.903a10.61 10.61 0 002.619-7.625l.005-.004-.006-.007a10.598 10.598 0 00-2.407-6.141l-1.008.904a9.291 9.291 0 01-.211 11.97l-3.023-2.71a5.233 5.233 0 00.205-6.546l-.004.003-.9.808a4.024 4.024 0 01-2.482 6.27zM12 21.149l.335-4.571.271-3.712a1.56 1.56 0 10-1.212 0l.271 3.712Z'
						/>
						<defs>
							<radialGradient
								id='glow'
								cx='1'
								cy='1'
								r='3'
								gradientUnits='userSpaceOnUse'
								gradientTransform={gradientTransform}>
								<stop stopColor={theme === Theme.DARK ? 'hsl(var(--success)' : 'hsl(var(--success)/50%)'} />
								<stop offset='1' stopColor='var(--border)' />
							</radialGradient>
						</defs>
					</svg>
				</figure>
				<div className='mx-auto my-4 w-full max-w-96 space-y-4 md:max-w-full md:space-y-6 @md/visual-card:max-w-full [&_div]:w-full'>
					<AnimatedSignalFigure titleLeft='/request/signal' titleRight={`{"action": "connect"}`} />
					<AnimatedSignalFigure titleLeft='/reply/data' titleRight={`{"data": "[...]"}`} animationReverse />
					<AnimatedSignalFigure titleLeft='/request/settings' titleRight={`{"ip": "10.xx.xx.xx"}`} />
				</div>
			</VisualCard.Content>
			<VisualCard.Footer>
				<ul className='flex flex-col gap-y-2 @2xl/visual-card:grid @2xl/visual-card:grid-cols-2 @2xl/visual-card:gap-x-4 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-x-2'>
					<li>
						<Icon name='Check' />
						Lightweight and efficient
					</li>
					<li>
						<Icon name='Check' />
						Supports multiple protocols
					</li>
					<li>
						<Icon name='Check' />
						Multi-Platform and Embedded Support
					</li>
					<li>
						<Icon name='Check' />
						Highly reliable messaging
					</li>
				</ul>
			</VisualCard.Footer>
		</VisualCard.Wrapper>
	)
}

const AnimatedSignalFigure: React.FC<{
	titleLeft?: string
	titleRight?: string
	animationReverse?: true
}> = ({ titleLeft, titleRight, animationReverse }) => {
	return (
		<div className='relative flex w-full items-center justify-between overflow-hidden'>
			<Badge variant='secondary' className='z-10 max-w-fit font-mono text-xs font-normal'>
				{titleLeft}
			</Badge>
			<Badge
				variant='outline'
				className='bg-background text-muted-foreground z-10 max-w-fit font-mono text-xs font-normal'>
				{titleRight}
			</Badge>
			<div
				className={cn(
					'absolute inset-x-0 top-1/2 flex w-full max-w-full flex-1 -translate-y-1/2 items-center gap-1 *:will-change-transform',
					animationReverse
						? '*:animate-[marquee-reverse_5s_linear_infinite]'
						: '*:animate-[marquee_5s_linear_infinite]'
				)}>
				<DashedLine />
				{cloneElement(<DashedLine />, {
					'aria-hidden': false
				})}
				{cloneElement(<DashedLine />, {
					'aria-hidden': false
				})}
			</div>
		</div>
	)
}

const DashedLine: React.FC = () => {
	return (
		<svg
			viewBox='0 0 100 1'
			className='z-[-1]'
			height={typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox') ? 1 : 0.5}
			width={216}
			preserveAspectRatio='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path d='M0 0.5 L100 0.5' stroke='var(--muted-foreground)' strokeWidth='1' strokeDasharray='4,2' fill='none' />
		</svg>
	)
}

export default MQTTVisualCard
