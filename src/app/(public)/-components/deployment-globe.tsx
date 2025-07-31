import { HoverCard, HoverCardContent, HoverCardTrigger, Icon } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../-contexts/page-context'

const DeploymentGlobe: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.75
	})

	return (
		<div
			ref={ref}
			className='relative inset-0 mx-auto aspect-[978/678] w-full max-w-2xl xl:max-w-3xl xl:translate-y-12'>
			<div className='group absolute left-[calc(50%+0.5rem)] top-[5%] z-20 flex w-72 -translate-x-1/2 items-center gap-x-3 whitespace-nowrap rounded-md border border-primary/50 bg-background px-3 py-2 shadow-2xl transition-colors duration-200 hover:border-primary sm:top-0 sm:w-60 sm:gap-2 sm:px-2 sm:py-1'>
				<div className='inline-flex flex-1 items-center gap-x-2'>
					<Icon name='Globe' strokeWidth={1} size={18} stroke='hsl(var(--muted-foreground))' />
					<Typewriter
						className='align-middle font-jetbrains text-xs leading-relaxed text-foreground sm:text-[10px]'
						playState={inViewport ? 'running' : 'paused'}
						text='Available in 2 regions'
					/>
				</div>
			</div>
			<svg
				id='svg1'
				xmlns='http://www.w3.org/2000/svg'
				width='100%'
				height='100%'
				fill='none'
				viewBox='0 0 155 284'
				data-viewport={inViewport ? 'visible' : 'invisible'}
				className='absolute animate-[fade-in_1.25s_cubic-bezier(.25,.25,0,1)_1.5s_both] data-[viewport=visible]:running data-[viewport=invisible]:paused'
				style={{ width: '15.244%', height: '41.24%', left: '38.8%', top: '31.2%' }}>
				<path
					stroke='url(#lg-svg1)'
					strokeWidth='1.396'
					d='M.797 283.216c14.605-22.693 64.498-78.738 87.739-104.396-22.406-17.823-47.852-46.354-57.983-58.555 36.536-29.153 96.735-65.699 122.267-80.327-6.727-8.041-21.226-27.282-26.518-39.053'></path>
				<defs>
					<linearGradient id='lg-svg1' x1='100%' x2='100%' y1='-20%' y2='130%' gradientUnits='userSpaceOnUse'>
						<stop offset='0' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
						<stop offset='0.5' stopColor='hsl(var(--foreground))' stopOpacity='0.6'></stop>
						<stop offset='1' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
					</linearGradient>
				</defs>
			</svg>
			<svg
				id='svg2'
				xmlns='http://www.w3.org/2000/svg'
				width='100%'
				height='100%'
				fill='none'
				viewBox='0 0 272 235'
				data-viewport={inViewport ? 'visible' : 'invisible'}
				className='absolute animate-[fade-in_1.25s_cubic-bezier(.25,.25,0,1)_1.5s_both] data-[viewport=visible]:running data-[viewport=invisible]:paused'
				style={{ width: '27.458%', height: '34.045%', left: '50.8%', top: '31.4%' }}>
				<path
					stroke='url(#lg-svg2)'
					strokeWidth='1.396'
					d='M271.749 233.614C215.075 230.474 159.599 210.964 138.945 201.602C144.38 186.681 156.517 152.612 161.587 135.71C126.058 122.39 44.25 76.75 1.25 0.75'></path>
				<defs>
					<linearGradient id='lg-svg2' x1='100%' x2='100%' y1='-20%' y2='130%' gradientUnits='userSpaceOnUse'>
						<stop offset='0' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
						<stop offset='0.5' stopColor='hsl(var(--foreground))' stopOpacity='0.6'></stop>
						<stop offset='1' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
					</linearGradient>
				</defs>
			</svg>
			<svg
				id='svg3'
				xmlns='http://www.w3.org/2000/svg'
				width='100%'
				height='100%'
				fill='none'
				viewBox='0 0 261 144'
				data-viewport={inViewport ? 'visible' : 'invisible'}
				className='absolute animate-[fade-in_1.25s_cubic-bezier(.25,.25,0,1)_1.5s_both] data-[viewport=visible]:running data-[viewport=invisible]:paused'
				style={{ width: '26.687%', height: '20.49%', left: '25.1%', top: '31.4%' }}>
				<path
					stroke='url(#lg-svg3)'
					strokeWidth='1.396'
					d='M260.5 1.5C157.75 30.75 67.75 89 1.13281 143.202'></path>
				<defs>
					<linearGradient id='lg-svg3' x1='100%' x2='100%' y1='-20%' y2='130%' gradientUnits='userSpaceOnUse'>
						<stop offset='0' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
						<stop offset='0.5' stopColor='hsl(var(--foreground))' stopOpacity='0.6'></stop>
						<stop offset='1' stopColor='hsl(var(--foreground))' stopOpacity='0'></stop>
					</linearGradient>
				</defs>
			</svg>
			<div
				id='dot1'
				data-viewport={inViewport ? 'visible' : 'invisible'}
				className='before:w absolute flex h-[3.5%] w-[2.5%] origin-center animate-[fade-in_0.75s_ease-out_1.25s_both] items-center justify-center opacity-0 transition-opacity data-[viewport=visible]:running data-[viewport=invisible]:paused'
				style={{ left: '50%', top: '29.9%' }}>
				<span className='absolute inset-0 h-full w-full rounded-full bg-foreground bg-opacity-20'></span>
				<span className='absolute h-4/5 w-4/5 animate-[ping_2s_ease-in-out_2s_infinite] rounded-full bg-foreground bg-opacity-90'></span>
			</div>
			<HoverCard>
				<HoverCardTrigger
					id='dot2'
					data-viewport={inViewport ? 'visible' : 'invisible'}
					className='absolute flex h-[3.5%] w-[2.5%] origin-center animate-[fade-in_0.875s_ease-out_1.75s_both] items-center justify-center opacity-0 transition-opacity data-[viewport=visible]:running data-[viewport=invisible]:paused'
					style={{ left: '24.3%', top: '50.2%' }}>
					<span className='absolute inset-0 rounded-full bg-foreground bg-opacity-20'></span>
					<span className='absolute h-4/5 w-4/5 animate-[ping_2s_ease-in-out_2s_infinite] rounded-full bg-foreground bg-opacity-90'></span>
				</HoverCardTrigger>
				<HoverCardContent className='bg-background/50 backdrop-blur-sm'>
					<ul className='space-y-2 text-sm'>
						<li className='grid grid-cols-[1.5rem_auto] items-start gap-x-2'>
							<Icon name='MapPin' size={20} /> 1166 Nguyen Binh Khiem, Dong Hai 2 Ward, Hai An District, Hai
							Phong City
						</li>
						<li className='grid grid-cols-[1.5rem_auto] items-start gap-x-2'>
							<Icon name='MapPin' size={20} /> Nam Am Village, Tam Cuong Commune, Vinh Bao District, Hai Phong
							City
						</li>
					</ul>
				</HoverCardContent>
			</HoverCard>
			<HoverCard>
				<HoverCardTrigger
					id='dot3'
					data-viewport={inViewport ? 'visible' : 'invisible'}
					className='absolute flex h-[3.5%] w-[2.5%] origin-center animate-[fade-in_0.875s_ease-out_1.75s_both] items-center justify-center opacity-0 transition-opacity data-[viewport=visible]:running data-[viewport=invisible]:paused'
					style={{ left: '77.8%', top: '63.4%' }}>
					<span className='absolute inset-0 h-full w-full rounded-full bg-foreground bg-opacity-20'></span>
					<span className='absolute h-4/5 w-4/5 animate-[ping_2s_ease-in-out_2s_infinite] rounded-full bg-foreground bg-opacity-90'></span>
				</HoverCardTrigger>
				<HoverCardContent className='bg-background/50 bg-opacity-50 backdrop-blur-sm'>
					<ul className='space-y-2 text-sm'>
						<li className='grid grid-cols-[1.5rem_auto] items-start gap-x-2'>
							<Icon name='MapPin' size={20} /> KHRU factory, Phnomphenh, Cambodia
						</li>
					</ul>
				</HoverCardContent>
			</HoverCard>

			<div className='absolute left-[51.15%] top-[10%] h-[20%] w-[2px] overflow-hidden'>
				<span
					data-viewport={inViewport ? 'visible' : 'invisible'}
					className='absolute inset-0 h-full w-full animate-[slide-in_0.25s_ease-out_1s_both] bg-gradient-to-t from-current to-transparent data-[viewport=visible]:running data-[viewport=invisible]:paused'
				/>
			</div>
			<img
				alt='globe wireframe'
				fetchPriority='high'
				width='500'
				height='500'
				decoding='async'
				data-nimg='1'
				className='h-full w-full'
				src='/globe.svg'
				loading='eager'
				style={{ color: 'transparent' }}
			/>
		</div>
	)
}

export default DeploymentGlobe
