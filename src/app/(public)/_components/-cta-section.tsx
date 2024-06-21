import { cn } from '@/common/utils/cn'
import { Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import HeroImage from '@/assets/images/hero-image.svg'
import tw from 'tailwind-styled-components'

export default function HeroSection() {
	const sectionRef = useRef<HTMLDivElement>(null)

	return (
		<Div
			ref={sectionRef}
			as='section'
			id='introduction'
			className='relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-grow flex-col items-center justify-center px-6 text-center sm:px-4'>
			<Typography variant='h2' className='mb-4 leading-tight sm:text-3xl'>
				Simplify Warehouse Management <br className='block xl:hidden xxl:hidden' /> with i-WMS
			</Typography>

			<Typography variant='p' className='mx-auto mb-12 max-w-6xl leading-relaxed tracking-wide xl:text-lg'>
				Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS. Our
				comprehensive system provides the tools you need to manage your warehouse effortlessly.
			</Typography>

			<Div className='flex items-center justify-center gap-x-1'>
				<Link to='/login' className={cn(buttonVariants())}>
					Get started
				</Link>
				<Link
					hash='#outstanding-features'
					className={buttonVariants({
						variant: 'link',
						className: 'items-center gap-x-2 !text-foreground'
					})}>
					Learn more <Icon name='ArrowRight' size={12} />
				</Link>
			</Div>
		</Div>
	)
}
