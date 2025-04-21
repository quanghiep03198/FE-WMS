import { Div, Icon, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'
import AnimatedBorderCard from './-animated-border-card'
import DeploymentGlobe from './-deployment-globe'

const CTA2Section: React.FC = () => {
	const pageContext = usePageContext()
	const topSectionRef = useRef<HTMLDivElement>(null)
	const bottomSectionRef = useRef<HTMLDivElement>(null)
	const [topSectionInViewPort] = useInViewport(topSectionRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})
	const [bottomSectionInViewPort] = useInViewport(bottomSectionRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.75
	})

	return (
		<Div>
			<Div
				ref={topSectionRef}
				className='grid animate-[fly-in_1s_ease] grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-[1fr_1.5fr]'
				style={{
					animationFillMode: 'both',
					animationPlayState: topSectionInViewPort ? 'running' : 'paused'
				}}>
				<Div className='flex flex-col gap-y-6 sm:gap-y-3 sm:text-center'>
					<Typography variant='small' className='font-jetbrains text-[var(--primary-alt)]'>
						EDGE DEPLOYMENT
					</Typography>
					<Typography variant='h3' className='text-pretty sm:text-lg'>
						High Availability at our factories across Asia
					</Typography>
					<Typography className='leading-relaxed tracking-wide sm:text-sm'>
						Our app is designed to provide exceptional reliability and performance at factories throughout Asia.
						Ensure seamless operations and robust connectivity where it’s needed most—empower your facilities
						today
					</Typography>
				</Div>
				<Div
					className='relative flex animate-none justify-end'
					style={{
						animationFillMode: 'both',
						animationPlayState: topSectionInViewPort ? 'running' : 'paused'
					}}>
					<DeploymentGlobe />
				</Div>
			</Div>
			<Div
				ref={bottomSectionRef}
				className='grid w-full animate-[fly-in_1s_ease] grid-cols-4 gap-6 sm:grid-cols-1 md:grid-cols-2'
				style={{
					animationFillMode: 'both',
					animationPlayState: bottomSectionInViewPort ? 'running' : 'paused'
				}}>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='Rocket'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-[var(--primary-alt)]'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-semibold'>Automatic Deployment</Typography>
						<Typography variant='small' color='muted'>
							Our applications are automatically deployed, delivering the latest updates quickly while ensuring
							minimal downtime and optimal efficiency.
						</Typography>
					</Div>
				</Div>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='CloudCog'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-[var(--primary-alt)]'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Fully managed</Typography>
						<Typography variant='small' color='muted'>
							Experience the convenience of a fully managed service, allowing you to focus on your core business
							while we handle the infrastructure.
						</Typography>
					</Div>
				</Div>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='Blocks'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-[var(--primary-alt)]'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Monitoring</Typography>
						<Typography
							variant='small'
							color='muted'
							dangerouslySetInnerHTML={{
								__html: /* template */ `
							
							Monitor your applications in real-time with <strong>PM2</strong>, <strong>Prometheus</strong> and <strong>Grafana</strong> , allowing you to control and manage your
							deployments remotely with ease.
							`
							}}
						/>
					</Div>
				</Div>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12 animate-shimmer bg-accent'>
						<Icon
							name='Server'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-[var(--primary-alt)]'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Server & Backup</Typography>
						<Typography variant='small' color='muted'>
							Secure your data with reliable servers and automated backups. Minimize downtime, protect critical
							information, and ensure seamless operations with scalable solutions tailored to our business.
						</Typography>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default CTA2Section
