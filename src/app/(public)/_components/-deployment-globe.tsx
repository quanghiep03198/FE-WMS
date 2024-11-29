import { cn } from '@/common/utils/cn'
import { HoverCard, HoverCardContent, HoverCardTrigger, Icon } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'

const DeploymentGlobe: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current
	})

	return (
		<div ref={ref} id='functions-hero' className='relative inset-0 mx-auto aspect-[978/678] w-full max-w-2xl'>
			<div
				className={cn(
					'absolute left-[25%] top-[2%] z-20 flex h-auto w-[60%] flex-1 animate-[fadeIn_0.5s_cubic-bezier(.25,.25,0,1)_0.2s_both] items-center justify-center opacity-0 sm:left-[34%] sm:top-[6%] sm:w-[35%] md:left-[33.5%] md:top-[6%] md:w-[35%] lg:left-[26%] lg:top-[3%] lg:w-[52%] xl:left-[28%] xl:top-[3%] xl:w-[48%] 2xl:left-[32%] 2xl:top-[3%] 2xl:w-[40%]',
					inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
				)}>
				<button className='group flex w-full min-w-64 -translate-y-1.5 items-center gap-1 gap-x-3 rounded-lg border border-primary/60 bg-transparent px-3 py-2 transition-colors duration-200 hover:border-primary sm:-translate-y-1/2 sm:gap-2 md:-translate-y-1/2'>
					<div
						className={cn(
							'flex flex-1 animate-[fadeIn_0.5s_cubic-bezier(.25,.25,0,1)_0.5s_both] items-center gap-x-2 whitespace-nowrap text-left font-mono text-xs text-foreground opacity-0 md:text-sm',
							inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
						)}>
						<Icon name='Globe' />
						Available in 2 regions
					</div>
				</button>
			</div>
			<svg
				id='svg1'
				xmlns='http://www.w3.org/2000/svg'
				width='100%'
				height='100%'
				fill='none'
				viewBox='0 0 155 284'
				className={cn(
					'absolute animate-[fadeIn_1s_cubic-bezier(.25,.25,0,1)_1s_both]',
					inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
				)}
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
				className={cn(
					'absolute animate-[fadeIn_1s_cubic-bezier(.25,.25,0,1)_1s_both]',
					inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
				)}
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
				className={cn(
					'absolute animate-[fadeIn_1s_cubic-bezier(.25,.25,0,1)_1s_both]',
					inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
				)}
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
				className={cn(
					'absolute flex h-[3.6%] w-[2.5%] origin-center animate-[fadeIn_0.75s_ease-out_1s_both] items-center justify-center opacity-0 transition-opacity',
					inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
				)}
				style={{ left: '50%', top: '29.9%' }}>
				<span className='absolute inset-0 h-full w-full rounded-full bg-foreground bg-opacity-20'></span>
				<span className='absolute h-4/5 w-4/5 rounded-full bg-foreground bg-opacity-90'></span>
			</div>
			<HoverCard>
				<HoverCardTrigger
					id='dot2'
					className={cn(
						'absolute flex h-[3.6%] w-[2.5%] origin-center animate-[fadeIn_0.75s_ease-out_1s_both] items-center justify-center opacity-0 transition-opacity',
						inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
					)}
					style={{ left: '24.3%', top: '50.2%' }}>
					<span className='absolute inset-0 h-full w-full rounded-full bg-foreground bg-opacity-20'></span>
					<span className='absolute h-4/5 w-4/5 rounded-full bg-foreground bg-opacity-90'></span>
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
					className={cn(
						'absolute flex h-[3.6%] w-[2.5%] origin-center animate-[fadeIn_0.75s_ease-out_1s_both] items-center justify-center opacity-0 transition-opacity',
						inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
					)}
					style={{ left: '77.8%', top: '63.4%' }}>
					<span className='absolute inset-0 h-full w-full rounded-full bg-foreground bg-opacity-20'></span>
					<span className='absolute h-4/5 w-4/5 rounded-full bg-foreground bg-opacity-90'></span>
				</HoverCardTrigger>
				<HoverCardContent className='bg-background/50 bg-opacity-50 backdrop-blur-sm'>
					<ul className='space-y-2 text-sm'>
						<li className='grid grid-cols-[1.5rem_auto] items-start gap-x-2'>
							<Icon name='MapPin' size={20} /> Phnomphenh, Cambodia
						</li>
					</ul>
				</HoverCardContent>
			</HoverCard>

			<div className='absolute left-[51.15%] top-[10%] h-[20%] w-[2px] overflow-hidden'>
				<span
					className={cn(
						'absolute inset-0 h-full w-full animate-[slideIn_0.25s_ease-out_0.5s_both] bg-gradient-to-t from-current to-transparent',
						inViewport ? '[animation-play-state:_running]' : '[animation-play-state:_paused]'
					)}
				/>
			</div>
			<img
				alt='globe wireframe'
				fetchPriority='high'
				width='400'
				height='400'
				decoding='async'
				data-nimg='1'
				className='block h-full w-full dark:hidden'
				src='https://res.cloudinary.com/djhwmxvxg/image/upload/v1732469652/globe.svg'
				style={{ color: 'transparent' }}
			/>
			<img
				alt='globe wireframe'
				fetchPriority='high'
				width='400'
				height='400'
				decoding='async'
				data-nimg='1'
				className='hidden h-full w-full dark:block'
				src='https://res.cloudinary.com/djhwmxvxg/image/upload/v1732469652/globe.svg'
				style={{ color: 'transparent' }}
			/>
		</div>
	)
}

export default DeploymentGlobe
