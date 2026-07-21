import { Button, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { cn } from '@common/utils/cn'
import env from '@common/utils/env'
import { Link } from '@tanstack/react-router'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import AnimatedScreen from './animated-screen'

const CTASection: React.FC = () => {
	const pageContext = usePageContext()
	const ref = useRef<HTMLElement>(null)

	const [isSectionInViewPort] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	const outstandingFeatures = [
		'High interactive user interface',
		'Real-time data streaming',
		'Automated Inbound, Outbound & Auditing Process',
		'Powerful analytics and reporting'
	]

	return (
		<Div
			id='cta'
			as='section'
			ref={ref}
			aria-current={isSectionInViewPort}
			className='group/cta relative mx-auto grid w-full max-w-7xl grid-flow-col auto-rows-auto grid-cols-1 items-center gap-y-0 px-6 py-10 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 paused @container/cta aria-current:running sm:px-4 sm:py-4 md:grid-cols-1 xl:grid-cols-2 xl:px-0 xxl:mt-32 xxl:max-w-8xl xxl:p-0'>
			<Div className='col-span-2 col-start-1 row-span-1 row-start-1 mb-4 flex justify-center @7xl/cta:col-span-1 @7xl/cta:justify-start'>
				<Button
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(1)
					}}
					variant='outline'
					className='rounded-l-full rounded-r-full px-5 tracking-wide transition-colors duration-200 hover:border-success hover:bg-success hover:text-success-foreground'>
					<Icon name='Tags' size={20} />
					Introducing version {env('VITE_APP_VERSION')}
					<Icon name='ArrowRight' className='ml-auto' />
				</Button>
			</Div>
			<Typography
				variant='h1'
				className='col-start-1 row-span-1 row-start-2 mb-4 max-w-full text-pretty text-center duration-700 @7xl/cta:max-w-xl @7xl/cta:text-left lg:col-span-2 lg:max-w-full'>
				Simplify Warehouse Management with <span className='text-(--primary-alt)'>i-WMS</span>
			</Typography>
			<Typography
				variant='p'
				className='col-start-1 row-span-1 row-start-3 mx-auto mb-6 max-w-4xl text-pretty text-center leading-relaxed tracking-wide @7xl/cta:text-left lg:col-span-2 lg:max-w-full lg:self-start xl:max-w-6xl xl:text-lg'>
				Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS. Our
				comprehensive system provides the tools you need to manage your warehouse effortlessly.
			</Typography>
			<List className='col-start-1 row-start-4 mx-auto grid w-full max-w-3xl grid-cols-1 gap-x-10 @xl/cta:grid-cols-2 @7xl/cta:grid-cols-1 lg:col-start-2 lg:row-start-4 lg:mt-10 lg:grid-cols-1 xl:mb-12'>
				{outstandingFeatures.map((feature, index) => (
					<ListItem key={index.toString()}>
						<Icon name='Check' size={18} />{' '}
						<Typography as='span' className='flex-1 text-base!'>
							{feature}
						</Typography>
					</ListItem>
				))}
			</List>
			<Div className='z-10 col-start-1 row-span-1 row-start-5 flex items-center justify-center gap-x-1 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 lg:col-start-2 lg:row-start-5 lg:justify-start xl:justify-start'>
				<Link to='/login' className={cn(buttonVariants())}>
					Get started
				</Link>
				<Button
					variant='link'
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(1)
					}}>
					Learn more <Icon name='ArrowRight' size={12} />
				</Button>
			</Div>
			<Div className='z-[-1] col-start-2 row-span-6 row-start-1 animate-none sm:inset-0 sm:col-start-1 sm:row-start-6 md:col-span-2 md:col-start-1 md:row-start-6 lg:z-[-1] lg:col-start-1 lg:row-start-4'>
				<AnimatedScreen />
			</Div>
		</Div>
	)
}

const List = tw.ul`grid gap-y-2 mb-8 sm:gap-y-2`
const ListItem = tw.li`flex w-full gap-x-2 text-base text-pretty text-muted-foreground [&>svg]:text-foreground [&>svg]:min-w-6 [&>svg]:translate-y-1.5 text-left`

export default CTASection
