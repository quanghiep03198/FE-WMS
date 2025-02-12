import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../_contexts/-page-context'

const CTASection: React.FC = () => {
	const { handleMenuClick } = usePageContext()

	return (
		<Div
			id='cta'
			as='section'
			className='mx-auto flex max-w-7xl flex-grow flex-col items-center gap-10 xl:flex-row xl:gap-20 xxl:max-w-8xl'>
			<Div className='flex flex-col items-center text-center xl:items-start xl:text-left'>
				<Button
					onClick={() => handleMenuClick(1)}
					variant='outline'
					className='mb-4 w-72 cursor-pointer justify-start gap-x-2 rounded-full border-primary/50 px-5 tracking-wide hover:bg-primary hover:text-primary-foreground'>
					<Icon name='Tags' size={20} />
					Introducing version {env('VITE_APP_VERSION')}
					<Icon name='ArrowRight' className='ml-auto' />
				</Button>
				<Typography variant='h3' className='mb-4 text-pretty sm:text-xl'>
					Simplify Warehouse Management with i-WMS
				</Typography>
				<Typography
					variant='p'
					className='mx-auto mb-10 max-w-4xl leading-relaxed tracking-wide sm:text-sm xl:max-w-6xl'>
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
				<Image
					loading='eager'
					width='500'
					height='500'
					src='/global-transport.svg'
					// src='https://res.cloudinary.com/djhwmxvxg/image/upload/v1732469652/global-transport.svg'
					alt='Global transport'
				/>
			</Div>
		</Div>
	)
}

const Image = tw.img`w-full max-w-xl xxl:max-w-2xl flex-1`

export default CTASection
