import { Div, DivProps, Icon, IconProps, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../_contexts/-page-context'
import BeamAnimated from './-beam-animated'

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
			className='relative mx-auto flex w-full max-w-7xl flex-col justify-center space-y-16 bg-background transition-opacity duration-700 animate-in fade-in-0 slide-in-from-bottom-4 xxl:max-w-8xl'
			id='outstanding-features'
			as='section'
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			{/* <svg
				aria-hidden='true'
				data-side='top-left'
				fill='none'
				height='75'
				viewBox='0 0 75 75'
				width='75'
				className='absolute left-0 top-0 -translate-x-full'>
				<path
					d='M74 37.5C74 30.281 71.8593 23.2241 67.8486 17.2217C63.838 11.2193 58.1375 6.541 51.4679 3.7784C44.7984 1.0158 37.4595 0.292977 30.3792 1.70134C23.2989 3.1097 16.7952 6.58599 11.6906 11.6906C6.58599 16.7952 3.1097 23.2989 1.70134 30.3792C0.292977 37.4595 1.0158 44.7984 3.7784 51.4679C6.541 58.1375 11.2193 63.838 17.2217 67.8486C23.2241 71.8593 30.281 74 37.5 74'
					className='stroke-neutral-300 dark:stroke-neutral-700'
					strokeDasharray='3 3'></path>
			</svg> */}
			{/* Horizontal dashed border */}
			{/* <Div className='absolute -left-24 -top-6 h-px w-[115%] bg-bottom bg-repeat-x [background-image:linear-gradient(to_right,#d4d4d4,#d4d4d4_50%,_transparent_0)] [background-size:_8px_1px] dark:[background-image:linear-gradient(to_right,#404040,#404040_50%,_transparent_0)]' /> */}
			{/* <Div className='absolute -bottom-8 -left-24 h-px w-[115%] bg-bottom bg-repeat-x [background-image:linear-gradient(to_right,#d4d4d4,#d4d4d4_50%,_transparent_0)] [background-size:_8px_1px] dark:[background-image:linear-gradient(to_right,#404040,#404040_50%,_transparent_0)]' /> */}
			{/* Vertical dashed border */}
			{/* <Div className='absolute -left-9 -top-20 h-[115%] w-px bg-right bg-repeat-y [background-image:linear-gradient(180deg,#d4d4d4,#d4d4d4_50%,_transparent_0)] [background-size:_1px_8px] dark:[background-image:linear-gradient(180deg,#404040,#404040_50%,_transparent_0)]' /> */}
			{/* <Div className='absolute -right-9 -top-20 h-[115%] w-px bg-right bg-repeat-y [background-image:linear-gradient(180deg,#d4d4d4,#d4d4d4_50%,_transparent_0)] [background-size:_1px_8px] dark:[background-image:linear-gradient(180deg,#404040,#404040_50%,_transparent_0)]' /> */}
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
			<Div className='grid items-center gap-10 xl:grid-cols-2'>
				<Div className='space-y-6'>
					<BeamAnimated />
					<Div className='flex flex-col space-y-3 text-center xl:text-left'>
						<Typography as='h5' variant='h6'>
							Outstanding Features
						</Typography>
						<Typography as='small' variant='small' color='muted' className='text-pretty xl:max-w-xl'>
							i-WMS streamlines warehouse operations with advanced inventory management, order processing, and
							real-time analytics, boosting efficiency and accuracy.
						</Typography>
					</Div>
				</Div>
				<Div className='grid w-full items-start gap-6 bg-background md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
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
								Enhance inventory tracking with barcode scanning and RFID integration for better visibility,
								faster scanning, and precise data capture, ensuring effective inventory management.
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
								performance, identify bottlenecks, and make data-driven decisions to enhance warehouse
								operations.
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
		</Div>
	)
}

const EffectCard = tw(
	Div
)<DivProps>`bg-background h-full border p-6 sm:p-4 hover:duration-200 justify-start overflow-hidden group/card flex flex-col gap-4 rounded-lg sm:flex-row hover:shadow-[0_0px_16px_rgb(0_0_0/0.1)] dark:hover:shadow-[0_0px_16px_var(--primary-alt)]`
const EffectCardIconWrapper = tw(
	Div
)<DivProps>`inline-flex aspect-square size-12 min-w-12 items-center justify-center rounded-md bg-secondary`
const EffectCardIcon = tw(Icon)<IconProps>`group-hover/card:stroke-[var(--primary-alt)] duration-200 transition-colors`
const EffectCardContent = tw(Div)`z-10 space-y-2`

export default FeaturesSection
