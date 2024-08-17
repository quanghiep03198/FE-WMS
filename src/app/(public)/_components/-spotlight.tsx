import { cn } from '@/common/utils/cn'

type SpotlightProps = {
	className?: string
	fill?: string
}

export default function Spotlight({ className, fill }: SpotlightProps) {
	return (
		<svg
			className={cn(
				'pointer-events-none absolute z-[1] h-[169%] w-[138%] animate-spotlight opacity-0 lg:w-[84%]',
				className
			)}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 3787 2842'
			fill='none'>
			<g filter='url(#filter)'>
				<ellipse
					cx='1924.71'
					cy='273.501'
					rx='1924.71'
					ry='273.501'
					transform='matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)'
					fill={fill || 'url(#gradient)'}
					fillOpacity='0.21'></ellipse>
			</g>
			<defs>
				<linearGradient id='gradient' x1='100%' y1='0%' x2='0%' y2='0%'>
					<stop offset='14%' stopColor='#ef4444' />
					<stop offset='28%' stopColor='#f97316' />
					<stop offset='42%' stopColor='#eab308' />
					<stop offset='56%' stopColor='#22c55e' />
					<stop offset='70%' stopColor='#3b82f6' />
					<stop offset='84%' stopColor='#6366f1' />
					<stop offset='100%' stopColor='#8b5cf6' />
				</linearGradient>
			</defs>
			<defs>
				<filter
					id='filter'
					x='0.860352'
					y='0.838989'
					width='3785.16'
					height='2840.26'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'>
					<feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
					<feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'></feBlend>
					<feGaussianBlur stdDeviation='151' result='effect1_foregroundBlur_1065_8'></feGaussianBlur>
				</filter>
			</defs>
		</svg>
	)
}
