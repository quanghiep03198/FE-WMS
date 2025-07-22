'use no memo'

import { cn } from '@/common/utils/cn'
import { Separator } from '@/components/ui'
import { useInViewport } from 'ahooks'
import React, { useEffect, useRef, useState } from 'react'
import { usePageContext } from '../-contexts/page-context'

const BeamAnimated: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const svgRef = useRef<SVGSVGElement>(null)

	const pageContext = usePageContext()
	const [renderCount, setRenderCount] = useState<number>(0)
	const [inViewport] = useInViewport(containerRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.75
	})

	useEffect(() => {
		if (inViewport) {
			svgRef.current?.setCurrentTime(0)
			setRenderCount((prev) => (prev === 0 ? 1 : prev + 1))
		}
	}, [inViewport])

	return (
		<div
			ref={containerRef}
			style={
				{
					'--green': '#22c55e',
					'--yellow': '#eab308'
				} as React.CSSProperties
			}
			className='group/chip container relative w-full'>
			<svg
				width='100%'
				height='200'
				viewBox='0 0 650 200'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				className='mx-auto xl:w-[650px]'
				ref={svgRef}>
				<defs>
					<linearGradient offset={1} id='right-to-left'>
						<stop offset={1} stopColor='hsl(var(--muted))'>
							<animate
								dur={0.5}
								attributeName='offset'
								fill='freeze'
								from={1}
								to={0}
								begin={1}
								calcMode='spline'
								keySplines='0.45 0.35 1 1'
							/>
						</stop>
						<stop offset={1} stopColor='var(--green)'>
							<animate
								dur={0.5}
								attributeName='offset'
								fill='freeze'
								from={1}
								to={0}
								begin={1}
								calcMode='spline'
								keySplines='0.45 0.35 1 1'
							/>
						</stop>
					</linearGradient>
					<linearGradient offset={0} id='left-to-right'>
						<stop offset={0} begin={1.5} stopColor='var(--yellow)'>
							<animate
								dur={0.5}
								attributeName='offset'
								fill='freeze'
								from={0}
								to={1}
								begin={1}
								calcMode='spline'
								keySplines='0.45 0.35 1 1'
							/>
						</stop>
						<stop offset={0} stopColor='hsl(var(--border))'>
							<animate
								dur={0.5}
								attributeName='offset'
								fill='freeze'
								from={0}
								to={1}
								begin={1}
								calcMode='spline'
								keySplines='0.45 0.35 1 1'
							/>
						</stop>
					</linearGradient>
				</defs>
				<g>
					{/* Standalone */}
					<g className='standalone-chip__base'>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(-0.845602 0.533814 -0.895247 -0.44557 611.937 102.855)'
							className='fill-neutral-100 dark:fill-neutral-800'
						/>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(-0.845602 0.533814 -0.895247 -0.44557 611.937 102.855)'
							className='stroke-neutral-200 dark:stroke-neutral-700'
							strokeOpacity='0.4'
							strokeWidth='4'
						/>
					</g>
					<g
						className={cn(
							'standalone-cube transition-all ease-in-out',
							renderCount > 0
								? 'translate-y-0 delay-500 ease-linear [&_path:first-child]:fill-[var(--green)] [&_path]:transition-colors [&_path]:delay-700 [&_path]:duration-1000'
								: '-translate-y-10 [&_path]:fill-muted'
						)}>
						<path
							stroke='hsl(var(--border))'
							d='M573.798 105.165L573.684 96.2398L581.79 90.9291L590.029 96.0306L590.143 104.956L582.027 109.523L573.798 105.165Z'
						/>
						<path
							d='M573.798 105.165L573.684 96.2398L581.79 90.9291L590.029 96.0306L590.143 104.956L582.027 109.523L573.798 105.165Z'
							fill='white'
							fillOpacity='0.5'
						/>
					</g>
					<path
						className='clustered-chip__connection'
						fillRule='evenodd'
						clipRule='evenodd'
						fill={
							renderCount === 1 ? 'url(#right-to-left)' : renderCount > 1 ? 'var(--green)' : 'hsl(var(--border))'
						}
						stroke={
							renderCount === 1 ? 'url(#right-to-left)' : renderCount > 1 ? 'var(--green)' : 'hsl(var(--border))'
						}
						d='M440.083 64.7972L456.9 53.3972C463.204 49.4177 473.724 48.8842 480.397 52.2055L565 94.5L562.717 95.9411L478.114 53.6466C472.776 50.9895 464.359 51.4164 459.316 54.6L442.5 66L440.083 64.7972Z'
						strokeWidth='1.2'
					/>
					<path
						className='standalone-chip__connection duration-500 animate-in'
						strokeDashoffset={0}
						fillRule='evenodd'
						clipRule='evenodd'
						d='M270 130L230.567 154.669C224.263 158.648 213.743 159.182 207.07 155.86L122.717 113.941L125 112.5L209.353 154.419C214.691 157.076 223.108 156.65 228.151 153.466L267.583 128.797L270 130Z'
						fill={
							renderCount > 1 ? 'var(--yellow)' : renderCount === 1 ? 'url(#left-to-right)' : 'hsl(var(--muted))'
						}
						stroke={
							renderCount > 1 ? 'var(--yellow)' : renderCount === 1 ? 'url(#left-to-right)' : 'hsl(var(--muted))'
						}
						strokeWidth='1.2'
					/>
					{/* Clustered */}
					<g className='clustered-chip__base'>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(0.845602 -0.533814 0.895247 0.44557 76.1337 105.512)'
							className='fill-neutral-100 dark:fill-neutral-800'
							shapeRendering='crispEdges'
						/>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(0.845602 -0.533814 0.895247 0.44557 76.1337 105.512)'
							className='stroke-neutral-200 dark:stroke-neutral-700'
							strokeOpacity='0.4'
							strokeWidth='4.39073'
							shapeRendering='crispEdges'
						/>
						<rect
							x='-0.0335319'
							y='-0.661506'
							width='152.647'
							height='152.647'
							rx='11.4823'
							transform='matrix(0.895247 0.44557 -0.845602 0.533814 330.028 12.7942)'
							stroke='url(#gradient-vite-chip-right-specular)'
							strokeWidth='1.2'
							data-v-3ad4b943=''
						/>
						<rect
							x='-0.0335319'
							y='-0.661506'
							width='152.647'
							height='152.647'
							rx='11.4823'
							transform='matrix(0.895247 0.44557 -0.845602 0.533814 330.028 12.7942)'
							stroke='url(#gradient-vite-chip-left-specular)'
							strokeOpacity='0.1'
							strokeWidth='1.2'
							data-v-3ad4b943=''
						/>
					</g>
					<g
						className={cn(
							'clustered-cube transition-transform ease-in-out',
							renderCount > 0
								? 'translate-y-0 delay-500 ease-linear [&_path:nth-child(odd)]:fill-[var(--yellow)] [&_path]:transition-colors [&_path]:delay-700 [&_path]:duration-1000'
								: '-translate-y-10 [&_path]:fill-muted'
						)}>
						<path
							d='M99.902 97.3307L99.7304 90.3097L106.066 86.0571L112.601 89.995L112.773 97.016L106.423 100.684L99.902 97.3307Z'
							fill='hsl(var(--muted))'
							stroke='hsl(var(--border))'
						/>
						<path
							d='M99.902 97.3307L99.7304 90.3097L106.066 86.0571L112.601 89.995L112.773 97.016L106.423 100.684L99.902 97.3307Z'
							fill='white'
							fillOpacity='0.5'
						/>
						<path
							d='M110.272 103.431L110.1 96.4099L116.435 92.1574L122.971 96.0953L123.143 103.116L116.793 106.784L110.272 103.431Z'
							fill='hsl(var(--muted))'
							stroke='hsl(var(--border))'
						/>
						<path
							d='M110.272 103.431L110.1 96.4099L116.435 92.1574L122.971 96.0953L123.143 103.116L116.793 106.784L110.272 103.431Z'
							fill='white'
							fillOpacity='0.5'
						/>
						<path
							d='M89.6627 103.976L89.491 96.9545L95.8263 92.7019L102.362 96.6398L102.533 103.661L96.1839 107.328L89.6627 103.976Z'
							fill='hsl(var(--muted))'
							stroke='hsl(var(--border))'
						/>
						<path
							d='M89.6627 103.976L89.491 96.9545L95.8263 92.7019L102.362 96.6398L102.533 103.661L96.1839 107.328L89.6627 103.976Z'
							fill='white'
							fillOpacity='0.5'
						/>
						<path
							d='M99.4817 109.323L99.31 102.302L105.645 98.0495L112.181 101.987L112.352 109.008L106.003 112.676L99.4817 109.323Z'
							fill='hsl(var(--muted))'
							stroke='hsl(var(--border))'
						/>
						<path
							d='M99.4817 109.323L99.31 102.302L105.645 98.0495L112.181 101.987L112.352 109.008L106.003 112.676L99.4817 109.323Z'
							fill='white'
							fillOpacity='0.5'
						/>
					</g>
				</g>
			</svg>
			<div
				style={{
					transform: 'translate(-50%,-50%) rotateX(50deg) rotateY(-5deg) rotateZ(44deg)',
					boxShadow: '16px 16px 24px #0a0a0a50'
				}}
				className={cn(
					'absolute top-1/2 z-20 flex aspect-square w-full items-center justify-center rounded-xl border-2 border-neutral-200 dark:border-neutral-700',
					'rounded-lg bg-[linear-gradient(130deg,#e5e5e5,35%,#fafafa,65%,#e5e5e5)] bg-[length:100%_100%] dark:bg-[linear-gradient(125deg,#262626,45%,#525252,55%,#262626)]',
					'left-[58%] sm:max-w-[144px]',
					'left-[56%] md:max-w-[196px]',
					'left-[52%] lg:max-w-[210px]',
					'xl:left-[62%] xl:max-w-[216px] xl:-translate-x-1/2',
					'-translate-y-1/2 xxl:left-[52%]'
				)}>
				<div className='relative grid h-full w-full flex-1 place-content-center'>
					<div
						className={cn(
							'flex aspect-square size-24 select-none flex-col items-center justify-center gap-y-6 rounded-lg p-4 sm:size-16 sm:gap-y-2 sm:p-2 sm:text-lg md:gap-y-4 md:p-4',
							renderCount > 0
								? '-translate-x-5 -translate-y-5 border-2 border-neutral-500 bg-primary text-primary-foreground shadow-[24px_24px_16px_#0a0a0a98] [transition:background-color_800ms_ease-in-out_1500ms,transform_400ms_cubic-bezier(0.68,-0.6,0.32,1.6)_1500ms,box-shadow_300ms_ease-out_1500ms] sm:-translate-x-3 sm:-translate-y-3'
								: 'translate-x-0 translate-y-0 !border-neutral-600 bg-neutral-500 text-neutral-700 shadow-none'
						)}>
						<span className='h-6 text-center font-jetbrains text-2xl font-semibold transition-none duration-0 sm:text-base md:text-2xl xl:text-2xl'>
							WMS
						</span>
						<Separator className='h-1 w-full bg-primary-foreground sm:h-0.5 md:h-1 lg:h-1' />
					</div>
				</div>
			</div>
			<div
				className={cn(
					'sm:size-18 absolute top-1/2 z-[-1] size-20 -translate-y-1/2 bg-[var(--yellow)] opacity-0 blur-3xl will-change-[opacity] sm:left-[6%] md:left-[18%] lg:left-[22%] lg:size-32 lg:blur-[80px] xl:left-[10%] xl:size-24 xxl:left-[12%] xxl:size-32 xxl:blur-[80px]',
					'transition-opacity delay-700 duration-500 ease-out',
					renderCount > 0 ? 'opacity-100' : 'opacity-0'
				)}
			/>
			<div
				className={cn(
					'sm:size-18 absolute top-1/2 z-[-1] size-20 -translate-y-1/2 bg-[var(--green)] opacity-0 blur-3xl will-change-[opacity] sm:right-[6%] md:right-[12%] lg:right-[22%] lg:size-32 lg:blur-[80px] xl:right-[-6%] xl:size-24 xxl:right-[6%] xxl:size-32 xxl:blur-[80px]',
					'transition-opacity delay-700 duration-500 ease-out',
					renderCount > 0 ? 'opacity-100' : 'opacity-0'
				)}
			/>
		</div>
	)
}

export default BeamAnimated
