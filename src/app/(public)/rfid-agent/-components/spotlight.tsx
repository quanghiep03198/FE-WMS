import { cn } from '@common/utils/cn'
import { useScroll } from 'ahooks'
import { Fragment } from 'react'
import { createPortal } from 'react-dom'

type SpotlightProps = {
	className?: string
	fill?: string
}

export default function Spotlight({ className, fill }: SpotlightProps) {
	const scroll = useScroll(document.querySelector('main'))

	return (
		<Fragment>
			{createPortal(
				<style>
					{
						/* CSS */ `
							@keyframes spotlight {
								0% {
									opacity: 0;
									transform: translate(-50%, -50%) scale(0.5);
								}
								100% {
									opacity: 1;
									transform:translate(-50%,-45%) scale(1);
								}
							}
							@keyframes spotlight-off {
								0% {
									opacity: 1;
									transform: translate(-50%,-40%) scale(1);
								}
								100% {
									opacity: 0;
									transform: translate(-75%, -60%) scale(0.5);
								}
							}
						.animate-spotlight{
							animation: spotlight 1s ease 0.25s forwards;
						}
						.animate-spotlight-off{
							animation: spotlight-off 3s ease forwards;
						}
						`
					}
				</style>,
				document.head
			)}
			<svg
				className={cn(
					'animate-spotlight pointer-events-none absolute z-1 h-[200%] opacity-0 transition-width sm:w-[200%] md:w-[150%] lg:w-[150%] xl:w-[120%]',
					{
						'animate-spotlight-off': scroll?.top > 10
					},
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
		</Fragment>
	)
}
