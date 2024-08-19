import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { usePageContext } from '../_contexts/-page-context'
// import BrowserMockup from './-browser-mockup'
import GlobalTransportImage from '@/assets/images/svgs/global-transport.svg'
import tw from 'tailwind-styled-components'

const CTASection: React.FC = () => {
	const { handleMenuClick } = usePageContext()

	return (
		<Div
			id='cta'
			as='section'
			className='relative mx-auto flex w-full max-w-7xl flex-grow flex-col items-center gap-20 px-6 sm:px-4 lg:flex-row xl:flex-row xxl:max-w-8xl'>
			<Div className='flex flex-col items-center text-center lg:items-start lg:text-left xl:items-start xl:text-left'>
				<Button
					onClick={() => handleMenuClick(1)}
					variant='outline'
					className='mb-4 w-72 cursor-pointer justify-start gap-x-2 rounded-full border-primary/50 px-5 tracking-wide hover:bg-primary hover:text-primary-foreground'>
					<Icon name='Tags' size={20} />
					Introducing version {env('VITE_APP_VERSION')}
					<Icon name='ArrowRight' className='ml-auto' />
				</Button>

				<Typography variant='h3' className='mb-4'>
					Simplify Warehouse Management <br /> with i-WMS
				</Typography>

				<Typography variant='p' className='mx-auto mb-10 max-w-4xl leading-relaxed tracking-wide xl:max-w-6xl'>
					Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS. Our
					comprehensive system provides the tools you need to manage your warehouse effortlessly.
				</Typography>

				<Div className='flex items-center justify-center gap-x-1'>
					<Link to='/login' className={cn(buttonVariants())}>
						Get started
					</Link>
					<Button variant='link' onClick={() => handleMenuClick(1)}>
						Learn more <Icon name='ArrowRight' size={12} role='img' />
					</Button>
				</Div>
			</Div>

			<Div className='flex h-full w-full flex-grow flex-col items-center justify-center'>
				<Image rel='preload' src={GlobalTransportImage} />
			</Div>
		</Div>
	)
}

const Image = tw.img`w-full max-w-xl xxl:max-w-2xl flex-1`

export default CTASection
