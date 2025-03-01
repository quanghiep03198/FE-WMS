import { Div, Icon, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'
import AnimatedBorderCard from './-animated-border-card'

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
			className='flex animate-[fly-in_1s_ease] flex-col justify-center space-y-16 sm:space-y-8'
			id='outstanding-features'
			as='section'
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='max-w-4xl space-y-1.5 text-left sm:text-center'>
				<Typography variant='small' className='!text-base font-medium sm:text-sm sm:font-normal'>
					No more paperwork
				</Typography>
				<Typography variant='h3' className='sm:mb-4 sm:text-xl'>
					Comprehensive solutions for Warehouse Management
				</Typography>
			</Div>
			<Div className='grid items-start gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
				<Div className='flex flex-col gap-4 sm:flex-row'>
					<AnimatedBorderCard className='aspect-square size-12 min-w-12'>
						<Icon name='Warehouse' strokeWidth={1.5} size={24} />
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-medium'>Inventory Tracking and Control</Typography>
						<Typography variant='small' color='muted'>
							i-WMS can help warehouse managers keep track of inventory levels, locations, and movement within
							the warehouse, ensuring optimal stock levels and minimizing stockouts.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-4 sm:flex-row'>
					<AnimatedBorderCard className='aspect-square size-12 min-w-12'>
						<Icon name='ScanBarcode' strokeWidth={1.5} size={24} />
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-medium'>Barcode Scanning and RFID Integration</Typography>
						<Typography variant='small' color='muted'>
							Integrating barcode scanning and RFID in WMS allows for precise and efficient inventory tracking
							across the warehouse. By providing improved visibility, faster scanning, and more accurate data
							capture, these features help ensure precise inventory tracking and management.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-4 sm:flex-row'>
					<AnimatedBorderCard className='aspect-square size-12 min-w-12'>
						<Icon name='FileText' strokeWidth={1.5} size={24} />
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-medium'>Reporting and Analytics</Typography>
						<Typography variant='small' color='muted'>
							i-WMS allows warehouse managers to monitor performance, identify bottlenecks and performance gaps,
							and supply insights for optimization.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-4 sm:flex-row'>
					<AnimatedBorderCard className='aspect-square size-12 min-w-12'>
						<Icon name='Languages' strokeWidth={1.5} size={24} />
					</AnimatedBorderCard>
					<Div className='space-y-2'>
						<Typography className='font-medium'>Multi-Language Support</Typography>
						<Typography
							variant='small'
							color='muted'
							dangerouslySetInnerHTML={{
								__html: /* html */ `i-WMS supports multiple languages including <b>English</b>, <b>Vietnamese</b> and <b>Chinese</b>, allowing users to interact with the system in their preferred language. This feature is particularly useful for multinational companies with employees from different regions.`
							}}
						/>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default FeaturesSection
