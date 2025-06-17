import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'

const CTASection: React.FC = () => {
	const pageContext = usePageContext()
	const { theme } = useTheme()

	const outstandingFeatures = [
		'Friendly UI/UX',
		'Real-time data streaming',
		'Automated Inbound, Outbound & Auditing Process',
		'Powerful analytics and reporting'
	]

	return (
		<Div
			id='cta'
			as='section'
			className='flex min-h-[85vh] flex-grow flex-col items-center gap-10 sm:gap-y-6 xl:flex-row xl:gap-20 xxl:max-w-8xl'>
			<Div className='flex flex-col items-center text-center duration-700 animate-in fade-in-0 slide-in-from-bottom-4 xl:items-start xl:text-left'>
				<Button
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(1)
					}}
					variant='outline'
					className='mb-4 w-72 cursor-pointer justify-start gap-x-2 rounded-full px-5 tracking-wide transition-colors duration-200 hover:!border-success hover:bg-transparent hover:text-success'>
					<Icon name='Tags' size={20} />
					Introducing version {env('VITE_APP_VERSION')}
					<Icon name='ArrowRight' className='ml-auto' />
				</Button>
				<Typography variant='h2' className='mb-4 max-w-xl text-pretty lg:max-w-full'>
					Simplify Warehouse Management with <span className='text-[var(--primary-alt)]'>i-WMS</span>
				</Typography>
				<Typography
					variant='p'
					className='mx-auto mb-6 max-w-4xl text-pretty leading-relaxed tracking-wide xl:max-w-6xl xl:text-lg'>
					Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS. Our
					comprehensive system provides the tools you need to manage your warehouse effortlessly.
				</Typography>
				<List className='mb-12 hidden grid-cols-1 gap-x-10 xl:grid'>
					{outstandingFeatures.map((feature, index) => (
						<ListItem key={index.toString()}>
							<Icon name='Check' size={18} />{' '}
							<Typography as='span' className='flex-1'>
								{feature}
							</Typography>
						</ListItem>
					))}
				</List>

				<Div className='hidden items-center justify-center gap-x-1 xl:flex'>
					<Link to='/login' className={cn(buttonVariants())}>
						Get started
					</Link>
					<Button
						variant='link'
						onClick={() => {
							if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(1)
						}}>
						Learn more <Icon name='ArrowRight' size={12} role='presentation' />
					</Button>
				</Div>
			</Div>
			<Div className='flex h-full w-full flex-grow flex-wrap items-center justify-center gap-y-10 lg:gap-x-12 xl:gap-y-0'>
				<Image src={theme === 'dark' ? '/shipping-dark.svg' : '/shipping-light.svg'} alt='Shipping' />
				<Div className='block space-y-10 lg:space-y-12 xl:hidden'>
					<List className='gap-y-6 *:font-medium *:text-foreground md:grid-cols-1 md:gap-x-6 lg:-translate-x-8'>
						{outstandingFeatures.map((feature, index) => (
							<ListItem key={index.toString()}>
								<Icon name='Check' size={18} />{' '}
								<Typography as='span' className='flex-1'>
									{feature}
								</Typography>
							</ListItem>
						))}
					</List>
					<Div className='flex items-center justify-start gap-x-1 md:justify-center'>
						<Link to='/login' className={cn(buttonVariants())}>
							Get started
						</Link>
						<Button
							variant='link'
							onClick={() => {
								if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(1)
							}}>
							Learn more <Icon name='ArrowRight' size={12} role='presentation' />
						</Button>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

const List = tw.ul`grid gap-y-2 mb-8 sm:gap-y-2`
const ListItem = tw.li`flex items-center gap-x-2 text-muted-foreground [&>svg]:text-foreground [&>svg]:min-w-6 whitespace-nowrap text-left`
const Image = tw.img`w-full max-w-lg md:max-w-md lg:max-w-xl sm:max-w-sm xl:max-w-3xl xxl:max-w-3xl flex-1`

export default CTASection
