import { Div, Typography } from '@/components/ui'
import { cloneElement } from 'react'
import tw from 'tailwind-styled-components'

const LogoCloud: React.FC = () => {
	return (
		<Div className='mx-auto flex w-full max-w-7xl flex-col flex-wrap items-center py-20 xxl:max-w-8xl'>
			<Typography className='font-medium lg:text-left xl:text-xl'>Built with open-source technologies</Typography>
			<Div className='group/scroll flex w-full max-w-xl flex-nowrap items-center justify-around space-x-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent_5%,hsl(var(--sidebar-background))_15%_85%,transparent)]'>
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
		className='mx-auto flex w-max animate-[scrolling_10s_forwards_linear_infinite] flex-nowrap items-center space-x-4 py-8 will-change-transform group-hover/scroll:paused'>
		<LinkCard href='#'>
			<img
				src='/typescript.svg'
				alt='TypeScript logo'
				className='h-6 saturate-[0] transition-all group-hover/card:saturate-100 xl:h-7'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/react.svg'
				alt='React'
				className='h-6 saturate-0 transition-all group-hover/card:saturate-100 xl:h-7'
			/>
		</LinkCard>
		<LinkCard href='#'>
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
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/tailwindcss.svg'
				alt='Tailwind CSS'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/tanstack.webp'
				alt='Tanstack'
				className='max-w-7 object-contain saturate-0 transition-all group-hover/card:saturate-100 xl:max-w-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/nest.svg'
				alt='NestJS'
				className='h-6 saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/mongodb.svg'
				alt='MongoDB'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/redis.svg'
				alt='Redis'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/sentry.svg'
				alt='Prometheus'
				className='h-7 saturate-0 transition-all group-hover/card:brightness-125 group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/prometheus.svg'
				alt='Prometheus'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/grafana.svg'
				alt='Grafana'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/sonarcloud.svg'
				alt='SonarCloud'
				className='h-7 saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
	</div>
)

const LinkCard = tw.a`'inline-flex rounded-md group/card flex aspect-square xl:h-14 h-12 border items-center justify-center bg-background p-0 shadow-[0px_2px_8px_rgba(10,10,10,0.2)] dark:shadow-[0px_2px_8px_rgba(82,82,82,0.3)] [&>img]:object-contain [&>img]:object-center`

export default LogoCloud
