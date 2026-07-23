import type { IconProps } from '@components/ui'
import { Badge, Div, Icon, Typography } from '@components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../contexts/page-context'
import BeamAnimated from './animated-chip'

const FeaturesSection: React.FunctionComponent = () => {
	const pageContext = usePageContext()
	const ref = useRef<HTMLDivElement>(null)
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.25
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
			className='animate-in fade-in-0 slide-in-from-bottom-4 xxl:max-w-8xl @container relative mx-auto flex w-full max-w-7xl flex-col justify-center space-y-16 px-3 py-10 transition-opacity duration-700 xl:px-0'
			id='outstanding-features'
			as='section'
			style={{
				animationFillMode: 'forwards',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='space-y-1.5 text-center sm:mb-4 sm:text-xl xl:text-left'>
				<Typography
					variant='small'
					className='w-full text-base! font-medium text-(--primary-alt) sm:text-sm sm:font-normal'>
					No more paperwork
				</Typography>
				<Typography variant='h1' className='text-pretty'>
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
					<Div className='flex flex-wrap items-center justify-center gap-2 sm:mx-auto sm:max-w-lg xl:justify-start'>
						<Badge variant='secondary' className='bg-red-500/10 text-red-500 hover:bg-red-500/20'>
							IoT
						</Badge>
						<Badge variant='secondary' className='bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'>
							RFID
						</Badge>
						<Badge variant='secondary' className='bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'>
							Multi-tenant
						</Badge>
						<Badge variant='secondary' className='bg-green-500/10 text-green-500 hover:bg-green-500/20'>
							Data-streaming
						</Badge>
						<Badge variant='secondary' className='bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'>
							Real-time
						</Badge>
						<Badge variant='secondary' className='bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20'>
							Internationalization
						</Badge>
						<Badge variant='secondary' className='bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'>
							Reporting
						</Badge>
					</Div>
				</Div>
				<Div className='grid w-full items-start gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
					{features.map((feature, index) => (
						// className={cn(
						// 	'duration-500 before:absolute before:inset-0 before:z-0 before:-translate-y-px before:bg-[conic-gradient(from_120deg_at_50%_50%,var(--accent)_0deg,var(--accent)_175deg,var(--primary-alt)_190deg,var(--accent)_220deg,var(--accent)_1turn)] before:opacity-0 before:transition-opacity before:duration-500 before:content-[""] hover:before:opacity-100 hover:before:animate-in hover:before:fade-in-0 hover:before:slide-in-from-left-10 xl:before:bg-[conic-gradient(from_130deg_at_50%_50%,var(--accent)_0deg,var(--accent)_175deg,var(--primary-alt)_190deg,var(--accent)_217deg,var(--accent)_1turn)]',
						// 	'after:absolute after:inset-0 after:left-1/2 after:top-1/2 after:z-10 after:h-[calc(100%-1px)] after:w-[calc(100%-1px)] after:-translate-x-1/2 after:-translate-y-[calc(50%-0.5px)] after:rounded-md after:bg-background after:content-[""]',
						// 	'hover:after:bg-linear-to-tr hover:after:from-background hover:after:from-30% hover:after:to-accent/60'
						// )}
						<EffectCard key={index.toString()}>
							<EffectCardIconWrapper className='z-20'>
								<EffectCardIcon
									name={feature.icon}
									className='group-hover/card:stroke-success'
									strokeWidth={1.5}
									size={24}
								/>
							</EffectCardIconWrapper>
							<EffectCardContent className='z-20'>
								<Typography className='font-medium'>{feature.name}</Typography>
								<Typography
									color='muted'
									className='text-pretty'
									dangerouslySetInnerHTML={{
										__html: feature.description
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

const EffectCard = tw.div`
	group/card relative overflow-hidden h-full border p-6 transition-colors bg-background
	flex flex-col justify-start gap-4 rounded-md 
	sm:p-4 sm:flex-row 
	hover:bg-linear-to-tr hover:from-background hover:from-30% hover:to-accent/60
`
const EffectCardIconWrapper = tw.div`inline-flex aspect-square size-12 mb-2 min-w-12 items-center justify-center rounded-md bg-secondary`
const EffectCardContent = tw.div`z-10 flex flex-col space-y-1.5`
const EffectCardIcon = tw(Icon)<IconProps>`group-hover/card:stroke-(--primary-alt) duration-200 transition-colors`

export default FeaturesSection
