import { cn } from '@/common/utils/cn'
import { Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import BrowserMockup from './-browser-mockup'

export default function HeroSection() {
	const sectionRef = useRef<HTMLDivElement>(null)

	return (
		<Div
			ref={sectionRef}
			as='section'
			id='cta'
			className='relative mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-8xl flex-grow flex-col items-center gap-20 px-6 py-20 sm:px-4 xl:flex-row xxl:max-w-8xl'>
			<Div className='flex flex-col items-center text-center xl:items-start xl:text-left'>
				<Typography
					className={cn(
						buttonVariants({
							variant: 'outline',
							className: 'mb-4 w-72 cursor-pointer justify-start gap-x-2 rounded-full px-5 tracking-wide'
						})
					)}>
					<Icon name='Tags' size={20} />
					Introducing version 1.0.0
					<Icon name='ArrowRight' className='ml-auto' />
				</Typography>

				<Typography variant='h1' className='mb-4 leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl'>
					Simplify Warehouse Management <br className='block xl:hidden xxl:hidden' /> with i-WMS
				</Typography>

				<Typography
					variant='p'
					className='mx-auto mb-14 max-w-4xl leading-relaxed tracking-wide sm:mb-10 xl:max-w-6xl xl:text-lg'>
					Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS. Our
					comprehensive system provides the tools you need to manage your warehouse effortlessly.
				</Typography>

				<Div className='flex items-center justify-center gap-x-1'>
					<Link to='/login' className={cn(buttonVariants())}>
						Get started
					</Link>
					<Link
						hash='outstanding-features'
						className={buttonVariants({
							variant: 'link',
							className: 'items-center gap-x-2 !text-foreground'
						})}>
						Learn more <Icon name='ArrowRight' size={12} />
					</Link>
				</Div>
			</Div>
			<BrowserMockup />
		</Div>
	)
}
