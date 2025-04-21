import { Div, DivProps, Icon, IconProps, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../_contexts/-page-context'

const FeaturesSection: React.FunctionComponent = () => {
	const pageContext = usePageContext()
	const ref = useRef<HTMLDivElement>(null)
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div
			ref={ref}
			className='mx-auto flex w-full max-w-7xl animate-[fly-in_1s_ease] flex-col justify-center space-y-16 xxl:max-w-8xl'
			id='outstanding-features'
			as='section'
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='max-w-4xl space-y-1.5 text-left sm:text-center'>
				<Typography
					variant='small'
					className='!text-base font-medium text-[var(--primary-alt)] sm:text-sm sm:font-normal'>
					No more paperwork
				</Typography>
				<Typography variant='h3' className='sm:mb-4 sm:text-xl'>
					Comprehensive solutions for Warehouse Management
				</Typography>
			</Div>
			<Div className='grid w-full items-start gap-6 bg-background md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
				<EffectCard>
					<EffectCardIconWrapper>
						<EffectCardIcon
							name='Warehouse'
							className='group-hover/card:stroke-success'
							strokeWidth={1.5}
							size={24}
						/>
					</EffectCardIconWrapper>
					<EffectCardContent>
						<Typography className='font-medium'>Inventory Tracking and Control</Typography>
						<Typography variant='small' color='muted' className='text-pretty'>
							i-WMS can help warehouse managers keep track of inventory levels, locations, and movement within
							the warehouse, ensuring optimal stock levels and minimizing stockouts.
						</Typography>
					</EffectCardContent>
				</EffectCard>
				<EffectCard>
					<EffectCardIconWrapper>
						<EffectCardIcon
							name='ScanBarcode'
							className='group-hover/feat:stroke-success'
							strokeWidth={1.5}
							size={24}
						/>
					</EffectCardIconWrapper>
					<EffectCardContent>
						<Typography className='font-medium'>Barcode and RFID Integration</Typography>
						<Typography variant='small' color='muted' className='text-pretty'>
							Enhance inventory tracking with barcode scanning and RFID integration for better visibility, faster
							scanning, and precise data capture, ensuring effective inventory management.
						</Typography>
					</EffectCardContent>
				</EffectCard>
				<EffectCard>
					<EffectCardIconWrapper>
						<EffectCardIcon name='FileText' strokeWidth={1.5} size={24} />
					</EffectCardIconWrapper>
					<EffectCardContent>
						<Typography className='font-medium'>Reporting and Analytics</Typography>
						<Typography variant='small' color='muted' className='text-pretty'>
							i-WMS provides customizable reports and real-time analytics, enabling managers to monitor
							performance, identify bottlenecks, and make data-driven decisions to enhance warehouse operations.
						</Typography>
					</EffectCardContent>
				</EffectCard>
				<EffectCard>
					<EffectCardIconWrapper>
						<EffectCardIcon name='Languages' strokeWidth={1.5} size={24} />
					</EffectCardIconWrapper>
					<EffectCardContent>
						<Typography className='font-medium'>Multi-Language Support</Typography>
						<Typography
							variant='small'
							color='muted'
							className='text-pretty'
							dangerouslySetInnerHTML={{
								__html: /* html */ `i-WMS supports multiple languages including <b>English</b>, <b>Vietnamese</b> and <b>Chinese</b>, allowing users to interact with the system in their preferred language.`
							}}
						/>
					</EffectCardContent>
				</EffectCard>
			</Div>
		</Div>
	)
}

const EffectCard = tw(
	Div
)<DivProps>`bg-background transition-all h-full border p-6 sm:p-4 duration-200 justify-start overflow-hidden group/card flex flex-col gap-4 rounded-lg sm:flex-row hover:shadow-[0_0px_16px_rgb(0_0_0/0.1)] dark:hover:shadow-[0_0px_16px_var(--primary-alt)]`
const EffectCardIconWrapper = tw(
	Div
)<DivProps>`inline-flex aspect-square size-12 min-w-12 items-center justify-center rounded-md bg-secondary`
const EffectCardIcon = tw(Icon)<IconProps>`group-hover/card:stroke-[var(--primary-alt)] duration-200 transition-colors`
const EffectCardContent = tw(Div)`z-10 space-y-2`

export default FeaturesSection
