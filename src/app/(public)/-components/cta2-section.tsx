import { Div, Icon, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../-contexts/page-context'
import AnimatedBorderCard from './animated-border-card'
import DeploymentGlobe from './deployment-globe'

const CTA2Section: React.FC = () => {
	const pageContext = usePageContext()
	const topSectionRef = useRef<HTMLDivElement>(null)
	const bottomSectionRef = useRef<HTMLDivElement>(null)
	const [isSectionInViewPort] = useInViewport(topSectionRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.75
	})

	return (
		<Div className='w-full border-b bg-linear-to-t from-accent/40 to-transparent to-20% px-3 py-10 xl:px-0'>
			<Div
				ref={topSectionRef}
				className='mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 lg:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_1.5fr] xxl:max-w-8xl'
				style={{
					animationFillMode: 'both',
					animationPlayState: isSectionInViewPort ? 'running' : 'paused'
				}}>
				<Div className='flex flex-col gap-y-6 sm:gap-y-3 sm:text-center md:text-center'>
					<Typography variant='small' className='font-jetbrains text-(--primary-alt)'>
						EDGE DEPLOYMENT
					</Typography>
					<Typography variant='h1' className='text-pretty'>
						High Availability at our factories across Asia
					</Typography>
					<Typography variant='p' className='leading-relaxed xl:text-lg'>
						Our app is designed to provide exceptional reliability and performance at factories throughout Asia.
						Ensure seamless operations and robust connectivity where it is needed most—empower your facilities
						today
					</Typography>
				</Div>
				<Div className='relative flex animate-none justify-end'>
					<DeploymentGlobe />
				</Div>
			</Div>
			<Div
				ref={bottomSectionRef}
				className='mx-auto grid w-full max-w-7xl grid-cols-4 gap-6 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 sm:grid-cols-1 md:grid-cols-2 xxl:max-w-8xl'
				style={{
					animationFillMode: 'both',
					animationPlayState: isSectionInViewPort ? 'running' : 'paused'
				}}>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row *:first:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='Rocket'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-(--primary-alt)'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography variant='h4' className='text-base sm:col-span-5'>
							Automatic Deployment
						</Typography>
						<Typography color='muted'>
							Our applications are automatically deployed, delivering the latest updates quickly while ensuring
							minimal downtime and optimal efficiency.
						</Typography>
					</Div>
				</Div>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row *:first:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='CloudCog'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-(--primary-alt)'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography variant='h4' className='text-base sm:col-span-5'>
							Fully managed
						</Typography>
						<Typography color='muted'>
							Experience the convenience of a fully managed service, allowing you to focus on your core business
							while we handle the infrastructure.
						</Typography>
					</Div>
				</Div>
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row *:first:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12'>
						<Icon
							name='Blocks'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-(--primary-alt)'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography variant='h4' className='text-base sm:col-span-5'>
							Monitoring
						</Typography>
						<Typography
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
				<Div className='group/cta2 flex flex-col gap-x-4 gap-y-2 sm:flex-row *:first:basis-1/6'>
					<AnimatedBorderCard className='aspect-square size-12 min-h-12 min-w-12 animate-shimmer bg-accent'>
						<Icon
							name='Server'
							strokeWidth={1.5}
							size={24}
							className='transition-colors duration-200 group-hover/cta2:stroke-(--primary-alt)'
						/>
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography variant='h4' className='text-base sm:col-span-5'>
							Server & Backup
						</Typography>
						<Typography color='muted'>
							Secure your data with reliable servers and automated backups. Minimize downtime, protect critical
							information, and ensure seamless operations.
						</Typography>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default CTA2Section
