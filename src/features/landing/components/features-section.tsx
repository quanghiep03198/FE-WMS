import { PresetBreakPoints } from '@common/constants/enums'
import { Div } from '@components/customs/div'
import { Typography, typographyVariants } from '@components/customs/typography'
import SplitText from '@components/motions/split-text'
import { Badge } from '@components/ui/badge'
import useMediaQuery from '@hooks/use-media-query'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../contexts/page-context'
import AnimatedChip from './animated-chip'
import FeaturesBento from './features-bento'

const FeaturesSection: React.FunctionComponent = () => {
	const pageContext = usePageContext()
	const ref = useRef<HTMLDivElement>(null)
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.25
	})

	return (
		<Div
			as='section'
			className='animate-in fade-in-0 slide-in-from-bottom-4 xxl:max-w-8xl @container relative mx-auto flex w-full max-w-7xl flex-col justify-center space-y-16 px-3 py-10 transition-opacity duration-700 xl:px-0'
			id='outstanding-features'
			ref={ref}
			style={{
				animationFillMode: 'forwards',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='space-y-1.5 text-center sm:mb-4 sm:text-xl xl:text-left flex flex-col'>
				<Typography
					className='w-full text-base! font-medium text-(--primary-alt) sm:text-sm sm:font-normal'
					variant='small'>
					No more paperwork
				</Typography>
				<SplitText
					className={typographyVariants({ variant: 'h1' })}
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
					text='Comprehensive solutions for Warehouse Management'
					textAlign={isLargeScreen ? 'left' : 'center'}
					threshold={0.1}
					trigger={inViewport ? 'load' : undefined}
				/>
			</Div>
			<Div className='grid items-center gap-10 xl:grid-cols-[1fr_1.25fr]'>
				<Div className='space-y-8 sm:space-y-6 xl:space-y-10'>
					<Div className='xl:-translate-x-12'>
						<AnimatedChip />
					</Div>
					<Div className='flex flex-col space-y-3 text-center xl:text-left'>
						<Typography variant='h4'>Outstanding Features</Typography>
						<Typography className='text-pretty' color='muted'>
							i-WMS streamlines warehouse operations with advanced inventory management, order processing, and
							real-time analytics, boosting efficiency and accuracy.
						</Typography>
					</Div>
					<Div className='flex flex-wrap items-center justify-center gap-2 sm:mx-auto sm:max-w-lg xl:justify-start'>
						<Badge className='bg-red-500/10 text-red-500 hover:bg-red-500/20' variant='secondary'>
							IoT
						</Badge>
						<Badge className='bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' variant='secondary'>
							RFID
						</Badge>
						<Badge className='bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' variant='secondary'>
							Multi-tenant
						</Badge>
						<Badge className='bg-green-500/10 text-green-500 hover:bg-green-500/20' variant='secondary'>
							Data-streaming
						</Badge>
						<Badge className='bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' variant='secondary'>
							Real-time
						</Badge>
						<Badge className='bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20' variant='secondary'>
							Internationalization
						</Badge>
						<Badge className='bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' variant='secondary'>
							Reporting
						</Badge>
					</Div>
				</Div>
				<FeaturesBento />
				{/* <Div className='grid w-full items-start gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
					{features.map((feature, index) => (
						// className={cn(
						// 	'duration-500 before:absolute before:inset-0 before:z-0 before:-translate-y-px before:bg-[conic-gradient(from_120deg_at_50%_50%,var(--accent)_0deg,var(--accent)_175deg,var(--primary-alt)_190deg,var(--accent)_220deg,var(--accent)_1turn)] before:opacity-0 before:transition-opacity before:duration-500 before:content-[""] hover:before:opacity-100 hover:before:animate-in hover:before:fade-in-0 hover:before:slide-in-from-left-10 xl:before:bg-[conic-gradient(from_130deg_at_50%_50%,var(--accent)_0deg,var(--accent)_175deg,var(--primary-alt)_190deg,var(--accent)_217deg,var(--accent)_1turn)]',
						// 	'after:absolute after:inset-0 after:left-1/2 after:top-1/2 after:z-10 after:h-[calc(100%-1px)] after:w-[calc(100%-1px)] after:-translate-x-1/2 after:-translate-y-[calc(50%-0.5px)] after:rounded-md after:bg-background after:content-[""]',
						// 	'hover:after:bg-linear-to-tr hover:after:from-background hover:after:from-30% hover:after:to-accent/60'
						// )}
						<EffectCard key={index.toString()}>
							<EffectCardIcon
								className='group-hover/card:stroke-success'
								name={feature.icon}
								size={24}
								strokeWidth={1.5}
							/>

							<EffectCardContent className='z-20'>
								<Typography className='font-medium'>{feature.name}</Typography>
								<Typography
									className='text-pretty'
									color='muted'
									dangerouslySetInnerHTML={{
										__html: feature.description
									}}
								/>
							</EffectCardContent>
						</EffectCard>
					))}
				</Div> */}
			</Div>
		</Div>
	)
}

export default FeaturesSection
