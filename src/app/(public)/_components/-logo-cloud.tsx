import { cn } from '@/common/utils/cn'
import { buttonVariants, Div, Typography } from '@/components/ui'
import { cloneElement } from 'react'

const LogoCloud: React.FC = () => {
	return (
		<Div className='mx-auto flex w-full max-w-7xl flex-col flex-wrap items-center gap-5 border-t py-20 xxl:max-w-8xl'>
			<Typography className='font-medium lg:text-left'>Built with open-source technologies</Typography>
			<Div className='group/scroll flex w-max max-w-lg flex-nowrap items-center justify-around space-x-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent_5%,hsl(var(--sidebar-background))_15%_85%,transparent)]'>
				<LogoList />
				{/* Clone element for infinite scroll effect */}
				{cloneElement(<LogoList />, { 'aria-hidden': true })}
			</Div>
		</Div>
	)
}

const LogoList: React.FC<React.ComponentProps<'div'>> = (props) => (
	<div
		{...props}
		className='mx-auto flex w-fit animate-[scrolling_10s_forwards_linear_infinite] flex-nowrap items-center space-x-4 will-change-transform group-hover/scroll:[animation-play-state:paused]'>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/typescript.svg'
				alt='TypeScript logo'
				className='h-6 saturate-[0] transition-all group-hover/card:saturate-100'
			/>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img src='/react.svg' alt='React' className='h-6 saturate-0 transition-all group-hover/card:saturate-100' />
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' className='h-6 w-6'>
				<rect width='256' height='256' fill='none'></rect>
				<line
					x1='208'
					y1='128'
					x2='128'
					y2='208'
					fill='none'
					className='stroke-muted-foreground group-hover/card:stroke-current'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='32'></line>
				<line
					x1='192'
					y1='40'
					x2='40'
					y2='192'
					fill='none'
					className='stroke-muted-foreground group-hover/card:stroke-current'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={32}></line>
			</svg>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/tailwindcss.svg'
				alt='Tailwind CSS'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/tanstack.webp'
				alt='Tanstack'
				className='max-w-7 object-contain saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img src='/nest.svg' alt='NestJS' className='h-6 saturate-0 transition-all group-hover/card:saturate-100' />
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/mongodb.svg'
				alt='MongoDB'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img src='/redis.svg' alt='Redis' className='h-7 saturate-0 transition-all group-hover/card:saturate-100' />
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 66' width='32' height='32'>
				<path
					d='M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z'
					transform='translate(11, 11)'
					className='fill-muted-foreground group-hover/card:fill-current'></path>
			</svg>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/prometheus.svg'
				alt='Prometheus'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</a>
		<a
			href='#'
			className={cn(
				buttonVariants({ variant: 'outline' }),
				'group/card flex aspect-square h-12 items-center justify-center bg-background p-0'
			)}>
			<img
				src='/grafana.svg'
				alt='Grafana'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</a>
	</div>
)

export default LogoCloud
