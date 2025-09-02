import { Div, Icon, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { cloneElement, useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'

const LogoCloud: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div
			id='logo-cloud'
			as='section'
			ref={ref}
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}
			className='relative w-full bg-gradient-to-t from-accent/40 to-transparent to-[30%] duration-700 animate-in fade-in-0 slide-in-from-bottom-4'>
			<Div className='mx-auto flex w-full max-w-7xl flex-col flex-wrap items-center pb-20 xxl:max-w-8xl'>
				<Div className='size-56 translate-y-12 place-content-center place-items-center rounded-full border border-foreground/20 [mask-image:linear-gradient(to_bottom,hsl(var(--background))_50%,hsl(var(--background))_50%,transparent)]'>
					<Div className='size-40 place-content-center place-items-center rounded-full border-[1.5px] border-foreground/35'>
						<Div className='relative size-24 place-content-center place-items-center rounded-full border border-foreground/50'>
							<Icon
								name='Codesandbox'
								className='z-20'
								strokeWidth={1}
								size={60}
								stroke='url(#codesandbox-gradient)'>
								<defs>
									<linearGradient
										id='codesandbox-gradient'
										x1='0'
										y1='20'
										x2='0'
										y2='0'
										gradientUnits='userSpaceOnUse'>
										<stop stopColor='hsl(var(--muted-foreground)' />
										<stop offset='1' stopColor='hsl(var(--foreground))' />
									</linearGradient>
								</defs>
							</Icon>
							{/* /> */}
						</Div>
					</Div>
				</Div>
				<Typography variant='h1' className='mb-2 mt-4'>
					Developed with trusted technologies
				</Typography>
				<Typography className='xl:text-lg'>
					We use the latest and most reliable technologies to build i-WMS, ensuring a robust and scalable solution.
				</Typography>
				<Div className='group/scroll flex w-full max-w-xl flex-nowrap items-center justify-around space-x-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent_5%,hsl(var(--sidebar-background))_15%_85%,transparent)]'>
					<LogoList />
					{/* Clone element for infinite scroll effect */}
					{cloneElement(<LogoList />, { 'aria-hidden': true })}
				</Div>
			</Div>
		</Div>
	)
}

const LogoList: React.FC<React.ComponentProps<'div'>> = (props) => (
	<div
		{...props}
		className='mx-auto flex w-max animate-[marquee_10s_forwards_linear_infinite] flex-nowrap items-center space-x-4 py-8 will-change-transform group-hover/scroll:paused'>
		<LinkCard href='#'>
			<img
				src='/typescript.svg'
				alt='TypeScript logo'
				loading='lazy'
				className='max-w-7 saturate-[0] transition-all group-hover/card:saturate-100'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/react.svg'
				alt='React'
				loading='lazy'
				className='max-w-7 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/vite.svg'
				alt='Vite'
				loading='lazy'
				className='max-w-7 saturate-0 transition-all group-hover/card:saturate-100'
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
				loading='lazy'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
				<path
					d='M10.9999 0C8.97378 0 7.07561 0.547792 5.44543 1.50334C5.11704 1.69583 4.97302 2.12364 5.25193 2.38269C5.49733 2.61062 5.82611 2.75 6.18743 2.75H15.8123C16.1737 2.75 16.5024 2.61062 16.7478 2.38269C17.0267 2.12364 16.8827 1.69583 16.5543 1.50334C14.9242 0.547792 13.026 0 10.9999 0Z'
					fill='currentColor'></path>
				<path
					d='M21.9998 11C21.9998 10.2406 21.3842 9.625 20.6248 9.625H1.37499C0.615588 9.625 0 10.2406 0 11C0 11.7594 0.615588 12.375 1.37499 12.375H20.6248C21.3842 12.375 21.9998 11.7594 21.9998 11Z'
					fill='currentColor'></path>
				<path
					d='M16.7478 19.6173C17.0267 19.8764 16.8827 20.3042 16.5543 20.4967C14.9242 21.4522 13.026 22 10.9999 22C8.97378 22 7.0756 21.4522 5.44542 20.4967C5.11704 20.3042 4.97302 19.8764 5.25192 19.6173C5.49732 19.3894 5.8261 19.25 6.18743 19.25H15.8123C16.1737 19.25 16.5024 19.3894 16.7478 19.6173Z'
					fill='currentColor'></path>
				<path
					d='M1.37499 6.1875C1.37499 5.42809 1.99057 4.8125 2.74997 4.8125H19.2498C20.0092 4.8125 20.6248 5.42809 20.6248 6.1875C20.6248 6.94691 20.0092 7.5625 19.2498 7.5625H2.74997C1.99057 7.5625 1.37499 6.94691 1.37499 6.1875Z'
					fill='currentColor'></path>
				<path
					d='M1.37499 15.8125C1.37499 15.0531 1.99057 14.4375 2.74997 14.4375H19.2498C20.0092 14.4375 20.6248 15.0531 20.6248 15.8125C20.6248 16.5719 20.0092 17.1875 19.2498 17.1875H2.74997C1.99057 17.1875 1.37499 16.5719 1.37499 15.8125Z'
					fill='currentColor'></path>
			</svg>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/reactquery.svg'
				alt='Tanstack'
				loading='lazy'
				className='max-w-8 object-contain saturate-0 transition-all group-hover/card:saturate-100 xl:max-w-9'
			/>
		</LinkCard>

		<LinkCard href='#'>
			<svg
				viewBox='0 0 256 256'
				xmlns='http://www.w3.org/2000/svg'
				preserveAspectRatio='xMinYMin meet'
				className='max-w-7 xl:max-w-8'>
				<circle
					cx='128'
					cy='128'
					r='114'
					className='stroke-muted-foreground group-hover/card:stroke-current'
					strokeWidth='20'
					fill='none'
				/>
				<path
					d='M97.637 121.69c27.327-22.326 54.058-45.426 81.98-67.097-14.646 22.505-29.708 44.711-44.354 67.215-12.562.06-25.123.06-37.626-.119zM120.737 134.132c12.621 0 25.183 0 37.745.179-27.505 22.206-54.117 45.484-82.099 67.096 14.646-22.505 29.708-44.77 44.354-67.275z'
					className='fill-muted-foreground group-hover/card:fill-current'
				/>
			</svg>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/nest.svg'
				alt='NestJS'
				loading='lazy'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/mongodb.svg'
				alt='MongoDB'
				loading='lazy'
				className='h-8 saturate-0 transition-all group-hover/card:saturate-100 xl:h-9'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/redis.svg'
				alt='Redis'
				loading='lazy'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/sentry.svg'
				alt='Prometheus'
				loading='lazy'
				className='max-w-8 saturate-0 transition-all group-hover/card:brightness-125 group-hover/card:saturate-100 xl:max-w-9'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/prometheus.svg'
				alt='Prometheus'
				loading='lazy'
				className='saturate-0 transition-all group-hover/card:saturate-100 xl:h-8'
			/>
		</LinkCard>
		<LinkCard href='#'>
			<img
				src='/grafana.svg'
				alt='Grafana'
				loading='lazy'
				className='max-w-8 saturate-0 transition-all group-hover/card:saturate-100'
			/>
		</LinkCard>
	</div>
)

const LinkCard = tw.a`rounded-md group/card flex aspect-square xl:h-14 h-12 border items-center justify-center bg-background p-0 shadow-[0px_2px_8px_rgba(10,10,10,0.2)] dark:shadow-[0px_2px_8px_rgba(82,82,82,0.3)] [&>img]:object-contain [&>img]:object-center`

export default LogoCloud
