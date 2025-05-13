import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import { Separator } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useEffect, useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'

const BeamAnimated: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const clusterCubesRef = useRef<SVGPathElement>(null)
	const standaloneCubeRef = useRef<SVGPathElement>(null)
	const greenPathRef = useRef<SVGPathElement>(null)
	const cyanPathRef = useRef<SVGPathElement>(null)
	const logoRef = useRef<HTMLDivElement>(null)
	const { theme } = useTheme()
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(containerRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 1
	})

	const animatePath = (path: SVGPathElement, color: string) => {
		if (!path) return

		path.style.transition = 'stroke 1.5s ease-out 1s, fill 1.5s ease-out 1s'
		path.style.fill = 'transparent'
		path.style.stroke = 'transparent'

		requestAnimationFrame(() => {
			path.style.fill = color
			path.style.stroke = color
		})
	}

	const animateLogo = () => {
		requestAnimationFrame(() => {
			logoRef.current.style.transition = 'transform 0.35s ease-out, box-shadow 0.5s ease-out 0.125s'
			logoRef.current.style.boxShadow = theme === Theme.LIGHT ? '4px 4px 16px #0a0a0a' : '4px 4px 16px #737373'
			logoRef.current.style.transform = 'translate(-8px,-8px)'
		})
	}

	useEffect(() => {
		if (inViewport) {
			animatePath(greenPathRef.current, '#22c55e')
			animatePath(cyanPathRef.current, '#22d3ee')
			const clusterCubes = clusterCubesRef.current?.childNodes
			const singleCube = standaloneCubeRef.current?.childNodes
			if (clusterCubes && Symbol.iterator in Object(clusterCubes)) {
				clusterCubes.forEach((path: SVGPathElement) => {
					if (!path.getAttribute('fill')) animatePath(path, '#22d3ee')
				})
			}
			if (singleCube && Symbol.iterator in Object(singleCube)) {
				singleCube.forEach((path: SVGPathElement) => {
					if (!path.getAttribute('fill')) animatePath(path, '#22c55e')
				})
			}

			const timerPath = setTimeout(() => {
				animatePath(greenPathRef.current, '#22c55e')
				animatePath(cyanPathRef.current, '#22d3ee')
			}, 750)
			const timerLogo = setTimeout(() => {
				animateLogo()
			}, 1000)

			return () => {
				clearTimeout(timerPath)
				clearTimeout(timerLogo)
			}
		}
	}, [inViewport])

	return (
		<div ref={containerRef} className='relative w-full'>
			<svg
				width='100%'
				height='200'
				viewBox='0 0 650 200'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				className='mx-auto xl:w-[650px]'>
				<g>
					<g className='green-chip__base'>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(-0.845602 0.533814 -0.895247 -0.44557 611.937 102.855)'
							className='fill-neutral-100 dark:fill-neutral-800'></rect>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(-0.845602 0.533814 -0.895247 -0.44557 611.937 102.855)'
							className='stroke-neutral-200 dark:stroke-neutral-700'
							strokeOpacity='0.4'
							strokeWidth='4'></rect>
					</g>
					<g className='standalone-cube' ref={standaloneCubeRef}>
						<path
							stroke='hsl(var(--border))'
							d='M573.798 105.165L573.684 96.2398L581.79 90.9291L590.029 96.0306L590.143 104.956L582.027 109.523L573.798 105.165Z'></path>
						<path
							d='M573.798 105.165L573.684 96.2398L581.79 90.9291L590.029 96.0306L590.143 104.956L582.027 109.523L573.798 105.165Z'
							fill='white'
							fillOpacity='0.5'></path>
					</g>
					<path
						className='green-chip__connection'
						ref={greenPathRef}
						fillRule='evenodd'
						clipRule='evenodd'
						d='M440.083 64.7972L456.9 53.3972C463.204 49.4177 473.724 48.8842 480.397 52.2055L565 94.5L562.717 95.9411L478.114 53.6466C472.776 50.9895 464.359 51.4164 459.316 54.6L442.5 66L440.083 64.7972Z'
						fill='hsl(var(--muted))'
						stroke='hsl(var(--border))'
						strokeWidth='1.2'></path>
					<path
						ref={cyanPathRef}
						className='cyan-chip__connection duration-500 animate-in'
						strokeDashoffset={0}
						fillRule='evenodd'
						clipRule='evenodd'
						d='M270 130L230.567 154.669C224.263 158.648 213.743 159.182 207.07 155.86L122.717 113.941L125 112.5L209.353 154.419C214.691 157.076 223.108 156.65 228.151 153.466L267.583 128.797L270 130Z'
						fill='hsl(var(--muted))'
						stroke='hsl(var(--border))'
						strokeWidth='1.2'></path>
					<g className='cyan-chip__base'>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(0.845602 -0.533814 0.895247 0.44557 76.1337 105.512)'
							className='fill-neutral-100 dark:fill-neutral-800'
							shapeRendering='crispEdges'></rect>
						<rect
							width='35.0955'
							height='35.0923'
							rx='5.87331'
							transform='matrix(0.845602 -0.533814 0.895247 0.44557 76.1337 105.512)'
							className='stroke-neutral-200 dark:stroke-neutral-700'
							strokeOpacity='0.4'
							strokeWidth='4.39073'
							shapeRendering='crispEdges'></rect>
						<rect
							x='-0.0335319'
							y='-0.661506'
							width='152.647'
							height='152.647'
							rx='11.4823'
							transform='matrix(0.895247 0.44557 -0.845602 0.533814 330.028 12.7942)'
							stroke='url(#gradient-vite-chip-right-specular)'
							strokeWidth='1.2'
							data-v-3ad4b943=''></rect>
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
							data-v-3ad4b943=''></rect>
					</g>

					<g className='cluster-cube' ref={clusterCubesRef}>
						<path
							d='M99.902 97.3307L99.7304 90.3097L106.066 86.0571L112.601 89.995L112.773 97.016L106.423 100.684L99.902 97.3307Z'
							stroke='hsl(var(--border))'></path>
						<path
							d='M99.902 97.3307L99.7304 90.3097L106.066 86.0571L112.601 89.995L112.773 97.016L106.423 100.684L99.902 97.3307Z'
							fill='white'
							fillOpacity='0.5'></path>
						<path
							d='M110.272 103.431L110.1 96.4099L116.435 92.1574L122.971 96.0953L123.143 103.116L116.793 106.784L110.272 103.431Z'
							stroke='hsl(var(--border))'></path>
						<path
							d='M110.272 103.431L110.1 96.4099L116.435 92.1574L122.971 96.0953L123.143 103.116L116.793 106.784L110.272 103.431Z'
							fill='white'
							fillOpacity='0.5'></path>
						<path
							d='M89.6627 103.976L89.491 96.9545L95.8263 92.7019L102.362 96.6398L102.533 103.661L96.1839 107.328L89.6627 103.976Z'
							stroke='hsl(var(--border))'></path>
						<path
							d='M89.6627 103.976L89.491 96.9545L95.8263 92.7019L102.362 96.6398L102.533 103.661L96.1839 107.328L89.6627 103.976Z'
							fill='white'
							fillOpacity='0.5'></path>
						<path
							d='M99.4817 109.323L99.31 102.302L105.645 98.0495L112.181 101.987L112.352 109.008L106.003 112.676L99.4817 109.323Z'
							stroke='hsl(var(--border))'></path>
						<path
							d='M99.4817 109.323L99.31 102.302L105.645 98.0495L112.181 101.987L112.352 109.008L106.003 112.676L99.4817 109.323Z'
							fill='white'
							fillOpacity='0.5'></path>
					</g>
				</g>
			</svg>
			<div
				style={{ transform: 'translate(-50%,-50%) rotateX(50deg) rotateY(-5deg) rotateZ(44deg)' }}
				className={cn(
					'absolute top-1/2 z-20 grid aspect-square w-full place-content-center rounded-xl shadow-2xl',
					'bg-secondary',
					'left-[56%] sm:max-w-[140px]',
					'left-[56%] md:max-w-[200px]',
					'left-[52%] lg:max-w-[210px]',
					'xl:left-[56%] xl:max-w-[210px] xl:-translate-x-1/2',
					'-translate-y-1/2 xxl:left-[52%]'
				)}>
				<div
					ref={logoRef}
					className='flex aspect-square size-20 select-none flex-col items-center justify-center gap-y-4 rounded-lg bg-primary p-4 text-primary-foreground shadow-[4px_2px_4px_hsl(var(--secondary))] sm:size-14 sm:gap-y-2 sm:p-2 md:gap-y-3 md:p-4'>
					<span className='h-6 text-center font-jetbrains text-xl font-semibold transition-none duration-0 sm:text-base md:text-lg'>
						WMS
					</span>
					<Separator className='h-[3px] w-full bg-primary-foreground' />
				</div>
			</div>
			<div className='absolute top-1/2 z-[-1] size-20 -translate-y-1/2 bg-[#22c55e] blur-[72px] will-change-[opacity] sm:right-0 sm:size-14 sm:blur-3xl md:right-[5%] lg:right-[25%] xl:right-[10%]' />
			<div className='absolute top-1/2 z-[-1] size-20 -translate-y-1/2 bg-[#22d3ee] blur-[72px] will-change-[opacity] sm:left-0 sm:size-14 sm:blur-3xl md:left-[5%] lg:left-[25%] xl:left-[10%]' />
		</div>
	)
}

export default BeamAnimated
