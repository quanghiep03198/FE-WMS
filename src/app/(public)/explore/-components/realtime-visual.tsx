import { useReducedMotion } from '@/common/hooks/use-reduce-motion'
import { cn } from '@/common/utils/cn'
import { Icon, Typography } from '@/components/ui'
import React, { useRef, useState } from 'react'

interface RealtimeVisualProps {
	className?: string
}

const RealtimeVisual: React.FC<RealtimeVisualProps> = ({ className }) => {
	const cardRef = useRef<HTMLDivElement | null>(null)
	const [svgTransformSelf, setSvgTransformSelf] = useState<string>('translate(0px, 0px)')
	const [svgTransform, setSvgTransform] = useState<string>('translate(0px, 0px)')
	const [svgTransform2, setSvgTransform2] = useState<string>('translate(0px, 0px)')
	const reduceMotion = typeof window !== 'undefined' && useReducedMotion()

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (cardRef.current) {
			const cardRect = cardRef.current.getBoundingClientRect()
			const mouseX = event.clientX - cardRect.left // Mouse X relative to card
			const mouseY = event.clientY - cardRect.top // Mouse Y relative to card
			const cardWidth = cardRect.width
			const cardHeight = cardRect.height

			const svgX = (mouseX / cardRect.width) * 100 - 50 // Calculate SVG X position
			const svgY = (mouseY / cardRect.height) * 100 - 50 // Calculate SVG Y position

			// Set the transform to move the SVG in the opposite direction
			setSvgTransform(
				`translate(${mouseX > cardWidth / 4 + 40 ? svgX * 3 : svgX * 1.2}px, ${mouseY > cardHeight / 2 + 30 ? -svgY * 1.5 : -svgY * 2.2}px)`
			)
			setSvgTransform2(
				`translate(${mouseX > cardWidth / 2 + 40 ? -svgX * 3 : svgX * 1.6}px, ${mouseY > cardHeight / 2 - 100 ? svgY * 1.2 : svgY * 2.8}px)`
			)
			setSvgTransformSelf(`translate(${mouseX + 12}px, ${mouseY + 4}px)`)
		}
	}

	const handleMouseLeave = () => {
		setSvgTransform('translate(0px, 0px)')
		setSvgTransform2('translate(0px, 0px)')
	}

	return (
		<div
			className={cn(
				'row-span-2 overflow-hidden rounded-lg border',
				"hover:!cursor-[url('realtime-cursor-light.svg'),_auto]",
				"dark:hover:!cursor-[url('realtime-cursor-dark.svg'),_auto]"
				// '[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_5%,black_5%)]'
			)}>
			<div className='space-y-2 p-4'>
				<Typography as='h5' className='inline-flex items-center gap-x-2 text-lg font-medium'>
					<Icon name='MousePointerClick' size={18} /> Realtime
				</Typography>
				<Typography>
					RFID Reader interaction <br />
					<span className='text-muted-foreground'>with real-time signal, data synchronization</span>
				</Typography>
			</div>
			<figure
				ref={cardRef}
				className={cn(
					'group pointer-events-auto relative z-0 h-60 w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,hsl(var(--background))_20%,hsl(var(--background))_100%)] xl:-bottom-2 2xl:bottom-0 xxl:h-80',
					className
				)}
				role='img'
				aria-label='Supabase Realtime multiplayer app demo'
				onMouseMove={reduceMotion ? undefined : handleMouseMove}
				onMouseLeave={handleMouseLeave} // Reset on mouse leave
			>
				<img
					src='/realtime-dark.svg'
					alt='Realtime'
					sizes='100%'
					className='absolute inset-0 hidden w-full object-cover dark:block xl:object-center'
				/>
				<img
					src='/realtime-light.svg'
					alt='Realtime'
					sizes='100%'
					className='absolute inset-0 w-full object-cover dark:hidden xl:object-center'
				/>
				{/* User 1 */}
				<div
					className='absolute will-change-transform'
					style={{
						position: 'absolute',
						top: '60%',
						left: '30%',
						transform: `${svgTransform} translate(-50%, -50%)`, // Center the SVG
						transition: 'transform 0.75s ease-out' // Smooth transition
					}}>
					<svg width='30' height='38' viewBox='0 0 30 38' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z'
							fill='hsl(var(--muted)/50%)'
							stroke='hsl(var(--border))'
							strokeLinejoin='round'
						/>
					</svg>

					<div className='absolute -top-6 left-full flex !h-[33.35px] !w-[66.70px] items-center justify-center gap-1 rounded-full border bg-muted/50'>
						<div className='pause group-hover:run h-1.5 w-1.5 rounded-full bg-muted-foreground group-hover:animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite]' />
						<div className='pause group-hover:run h-1.5 w-1.5 rounded-full bg-muted-foreground group-hover:animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite]' />
						<div className='pause group-hover:run h-1.5 w-1.5 rounded-full bg-muted-foreground group-hover:animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite]' />
					</div>
				</div>
				{/* User 2 */}
				<div
					className='absolute scale-[80%] will-change-transform'
					style={{
						position: 'absolute',
						top: '80%',
						left: '65%',
						transform: `${svgTransform2} translate(-50%, -50%)`, // Center the SVG
						transition: 'transform 1s ease-out' // Smooth transition
					}}>
					<svg width='20' height='28' viewBox='0 0 30 38' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z'
							fill='hsl(var(--muted)/50%)'
							stroke='hsl(var(--border))'
							strokeLinejoin='round'
						/>
					</svg>

					<div className='absolute -top-6 left-full flex !h-[28px] !w-[55px] items-center justify-center gap-1 rounded-full border border-border bg-muted/50 opacity-0 transition-opacity group-hover:opacity-100'>
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-muted-foreground' />
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite] rounded-full bg-muted-foreground' />
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite] rounded-full bg-muted-foreground' />
					</div>
				</div>
				{/* Self */}
				<div
					className='absolute h-1 w-1 opacity-0 transition-opacity delay-0 duration-75 will-change-transform group-hover:duration-300 motion-safe:group-hover:opacity-100'
					style={{
						position: 'absolute',
						top: '0',
						left: '0',
						transform: `${svgTransformSelf} translate(-50%, -50%)`, // Center the SVG
						transition: 'transform 0.1s ease-out' // Smooth transition
					}}>
					<div className='absolute -top-6 left-full flex h-auto w-auto items-center justify-center gap-1 rounded-full border bg-success/20 px-2.5 py-1.5'>
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-success' />
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_200ms_infinite] rounded-full bg-success' />
						<div className='pause group-hover:run h-1.5 w-1.5 animate-[pulse_600ms_cubic-bezier(0.4,0,0.6,1)_400ms_infinite] rounded-full bg-success' />
					</div>
				</div>
				{/* Gradient to hide animation under text to maintain readability */}
				<div className='visual-overlay pointer-events-none absolute inset-0 top-auto h-full max-h-[400px] w-full bg-[linear-gradient(to_top,transparent_0%,transparent_50%,hsl(var(--background-surface-75))_85%)] lg:max-h-none' />
			</figure>
		</div>
	)
}

export default RealtimeVisual
