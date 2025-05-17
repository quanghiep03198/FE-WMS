import { Div, DivProps, Icon, IconProps, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../_contexts/-page-context'
import BeamAnimated from './-animated-chip'

const FeaturesSection: React.FunctionComponent = () => {
	const pageContext = usePageContext()
	const ref = useRef<HTMLDivElement>(null)
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	const features: Array<{ icon: React.ComponentProps<typeof Icon>['name']; name: string; description: string }> = [
		{
			icon: 'Warehouse',
			name: 'Inventory Tracking and Control',
			description:
				'i-WMS can help warehouse managers keep track of inventory levels, locations, and movement within the warehouse, ensuring optimal stock levels and minimizing stockouts.'
		},
		{
			icon: 'ScanBarcode',
			name: 'Barcode and RFID Integration',
			description:
				'Enhance inventory tracking with barcode scanning and RFID integration for better visibility, faster scanning, and precise data capture, ensuring effective inventory management.'
		},
		{
			icon: 'FileText',
			name: 'Reporting and Analytics',
			description:
				'i-WMS provides customizable reports and real-time analytics, enabling managers to monitor performance, identify bottlenecks, and make data-driven decisions to enhance warehouse operations.'
		},
		{
			icon: 'Languages',
			name: 'Multi-Language Support',
			description: /* template */ `i-WMS supports multiple languages including <b>English</b>, <b>Vietnamese</b> and <b>Chinese</b>, allowing users to interact with the system in their preferred language.`
		}
	]

	return (
		<Div
			ref={ref}
			className='relative mx-auto flex w-full max-w-7xl flex-col justify-center space-y-16 transition-opacity duration-700 animate-in fade-in-0 slide-in-from-bottom-4 @container xxl:max-w-8xl'
			id='outstanding-features'
			as='section'
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='space-y-1.5 text-center sm:mb-4 sm:text-xl xl:text-left'>
				<Typography
					variant='small'
					className='w-full !text-base font-medium text-[var(--primary-alt)] sm:text-sm sm:font-normal'>
					No more paperwork
				</Typography>
				<Typography variant='h2' className='text-pretty'>
					Comprehensive solutions for <br className='hidden lg:block' /> Warehouse Management
				</Typography>
			</Div>
			<Div className='grid items-center gap-10 xl:grid-cols-2'>
				<Div className='space-y-8 sm:space-y-6 xl:space-y-10'>
					<Div className='xl:-translate-x-12'>
						<BeamAnimated />
					</Div>
					<Div className='flex flex-col space-y-3 text-center xl:text-left'>
						<Typography variant='h4'>Outstanding Features</Typography>
						<Typography color='muted' className='text-pretty'>
							i-WMS streamlines warehouse operations with advanced inventory management, order processing, and
							real-time analytics, boosting efficiency and accuracy.
						</Typography>
					</Div>
				</Div>
				<Div className='grid w-full items-start gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
					{features.map((feature, index) => (
						<EffectCard key={index.toString()}>
							<EffectCardIconWrapper>
								<EffectCardIcon
									name={feature.icon}
									className='group-hover/card:stroke-success'
									strokeWidth={1.5}
									size={24}
								/>
							</EffectCardIconWrapper>
							<EffectCardContent>
								<Typography className='font-medium'>{feature.name}</Typography>
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
					))}
				</Div>
			</Div>
		</Div>
	)
}

const EffectCard = tw(
	Div
)<DivProps>`bg-background h-full border p-6 sm:p-4 hover:duration-200 justify-start overflow-hidden group/card flex flex-col gap-4 rounded-lg sm:flex-row hover:shadow-[0_0px_16px_rgb(0_0_0/0.1)] dark:hover:shadow-[0_0px_16px_var(--primary-alt)]`
const EffectCardIconWrapper = tw(
	Div
)<DivProps>`inline-flex aspect-square size-12 mb-2 min-w-12 items-center justify-center rounded-md bg-secondary`
const EffectCardIcon = tw(Icon)<IconProps>`group-hover/card:stroke-[var(--primary-alt)] duration-200 transition-colors`
const EffectCardContent = tw(Div)`z-10 flex flex-col space-y-1.5`

export default FeaturesSection
