import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import { useInViewport } from 'ahooks'
import { cloneElement, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../contexts/page-context'

const LogoCloud: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div
			as='section'
			className='from-accent/40 animate-in fade-in-0 slide-in-from-bottom-4 relative w-full bg-linear-to-t to-transparent to-30% duration-700 sm:px-2'
			id='logo-cloud'
			ref={ref}
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='xxl:max-w-8xl mx-auto flex w-full max-w-7xl flex-col flex-wrap items-center pb-20 text-center'>
				<Div className='border-foreground/20 inline-grid size-56 translate-y-12 place-items-center rounded-full border mask-[linear-gradient(to_bottom,var(--background)_50%,var(--background)_50%,transparent)]'>
					<Div className='border-foreground/35 inline-grid size-40 place-items-center rounded-full border-[1.5px]'>
						<Div className='border-foreground/50 relative inline-grid size-24 place-items-center rounded-full border'>
							<Icon className='z-20' name='Codesandbox' size={60} strokeWidth={1}></Icon>
							{/* /> */}
						</Div>
					</Div>
				</Div>
				<Typography className='mt-4 mb-2' variant='h1'>
					Developed with trusted technologies
				</Typography>
				<Typography className='text-pretty xl:text-lg'>
					We use the latest and most reliable technologies to build i-WMS, ensuring a robust and scalable solution.
				</Typography>
				<Div className='group/scroll flex w-full max-w-xl flex-nowrap items-center justify-around space-x-4 overflow-hidden mask-[linear-gradient(to_right,transparent_5%,var(--sidebar-background)_15%_85%,transparent)]'>
					<LogoList />
					{/* Clone element for infinite scroll effect */}
					{cloneElement(<LogoList />, { 'aria-hidden': true })}
					{cloneElement(<LogoList />, { 'aria-hidden': true })}
				</Div>
			</Div>
		</Div>
	)
}

const LogoList: React.FC<React.ComponentProps<'div'>> = (props) => (
	<div
		{...props}
		className='group-hover/scroll:paused mx-auto flex w-max animate-[marquee_10s_forwards_linear_infinite] flex-nowrap items-center space-x-4 py-8 will-change-transform'>
		<LinkCard href='#'>
			<img
				alt='React'
				className='max-w-7 saturate-0 transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/react.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Tanstack'
				className='max-w-9 object-contain saturate-0 transition-all group-hover/card:saturate-100 xl:max-w-9'
				loading='lazy'
				src='/tanstack.png'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Vite'
				className='max-w-7 saturate-0 transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/vite.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<svg className='h-6 w-6' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'>
				<rect fill='none' height='256' width='256'></rect>
				<line
					className='stroke-muted-foreground group-hover/card:stroke-current'
					fill='none'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='32'
					x1='208'
					x2='128'
					y1='128'
					y2='208'></line>
				<line
					className='stroke-muted-foreground group-hover/card:stroke-current'
					fill='none'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={32}
					x1='192'
					x2='40'
					y1='40'
					y2='192'></line>
			</svg>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Tailwind CSS'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
				loading='lazy'
				src='/tailwindcss.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='NestJS'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/nest.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='MongoDB'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
				loading='lazy'
				src='/mongodb.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='SQL Server'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
				loading='lazy'
				src='/sql-server.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Redis'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/redis.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Mosquitto'
				className='max-w-8 saturate-[0] transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/mosquitto.png'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Prometheus'
				className='max-w-8 saturate-0 transition-all group-hover/card:brightness-125 group-hover/card:saturate-100 xl:max-w-9'
				loading='lazy'
				src='/sentry.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Prometheus'
				className='saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
				loading='lazy'
				src='/prometheus.svg'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				alt='Grafana'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
				loading='lazy'
				src='/grafana.svg'
			/>
		</LinkCard>
	</div>
)

const LinkCard = tw.a`rounded-md group/card flex aspect-square xl:h-14 h-12 border items-center justify-center bg-background p-0 shadow-[0px_2px_8px_rgba(10,10,10,0.2)] dark:shadow-[0px_2px_8px_rgba(82,82,82,0.3)] [&>img]:object-contain [&>img]:object-center`

export default LogoCloud
