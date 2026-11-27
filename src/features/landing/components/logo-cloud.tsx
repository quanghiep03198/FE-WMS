import { Div } from '@components/customs/div'
import { Typography, typographyVariants } from '@components/customs/typography'
import type { LogoItem } from '@components/motions/logo-loop'
import LogoLoop from '@components/motions/logo-loop'
import SplitText from '@components/motions/split-text'
import { Icon } from '@components/ui/icon'
import useTheme from '@hooks/use-theme'
import { useInViewport } from 'ahooks'
import { useMemo, useRef } from 'react'
import { usePageContext } from '../contexts/page-context'

const LogoCloud: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const { theme } = useTheme()
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	const logos: LogoItem[] = useMemo(
		() => [
			{
				src: '/react.svg',
				alt: 'React',
				href: 'https://react.dev/',
				title: 'React'
			},
			{
				src: theme === 'dark' ? '/tanstack-white.svg' : '/tanstack-black.svg',
				alt: 'Tanstack',
				href: 'https://tanstack.com/',
				title: 'TanStack'
			},
			{
				src: '/vite.svg',
				alt: 'Vite',
				href: 'https://vitejs.dev/',
				title: 'Vite'
			},
			{
				src: '/tailwindcss.svg',
				alt: 'Tailwind CSS',
				href: 'https://tailwindcss.com/',
				title: 'Tailwind CSS'
			},
			{
				src: '/nest.svg',
				alt: 'NestJS',
				href: 'https://nestjs.com/',
				title: 'NestJS'
			},
			{
				src: '/mongodb.svg',
				alt: 'MongoDB',
				href: 'https://www.mongodb.com/',
				title: 'MongoDB'
			},
			{
				src: '/sql-server.svg',
				alt: 'MSSQL',
				href: 'https://www.microsoft.com/en-us/sql-server',
				title: 'MSSQL'
			},
			{
				src: '/redis.svg',
				alt: 'Redis',
				href: 'https://redis.io/',
				title: 'Redis'
			},
			{
				src: '/mosquitto.png',
				alt: 'Mosquitto',
				href: 'https://mosquitto.org/',
				title: 'Mosquitto'
			},
			{
				src: '/sentry.svg',
				alt: 'Sentry',
				href: 'https://sentry.io/',
				title: 'Sentry'
			},
			{
				src: '/prometheus.svg',
				alt: 'Prometheus',
				href: 'https://prometheus.io/',
				title: 'Prometheus'
			},
			{
				src: '/grafana.svg',
				alt: 'Grafana',
				href: 'https://grafana.com/',
				title: 'Grafana'
			}
		],
		[theme]
	)

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
				<SplitText
					className={typographyVariants({ variant: 'h1', className: 'mt-4 mb-2' })}
					delay={50}
					duration={0.5}
					effect='blur'
					hoverEffect='none'
					loop={false}
					mask={false}
					rootMargin='-100px'
					splitType='chars'
					staggerFrom='start'
					tag='h1'
					text='Developed with trusted technologies'
					textAlign='center'
					threshold={0.1}
					trigger={inViewport ? 'load' : undefined}
				/>

				<Typography className='text-pretty xl:text-lg'>
					We use the latest and most reliable technologies to build i-WMS, ensuring a robust and scalable solution.
				</Typography>
				<LogoLoop
					ariaLabel='Technology partners'
					className='max-w-4xl mt-6'
					direction='left'
					gap={56}
					hoverSpeed={0}
					labels='hover'
					logoHeight={48}
					logos={logos}
					scaleOnHover={true}
					speed={100}
				/>
				{/* <Div className='group/scroll flex w-full max-w-xl flex-nowrap items-center justify-around space-x-4 overflow-hidden mask-[linear-gradient(to_right,transparent_5%,var(--sidebar-background)_15%_85%,transparent)]'>
					<LogoList />
					{cloneElement(<LogoList />, { 'aria-hidden': true })}
					{cloneElement(<LogoList />, { 'aria-hidden': true })}
				</Div> */}
			</Div>
		</Div>
	)
}

export default LogoCloud
