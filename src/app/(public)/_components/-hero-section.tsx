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
			className='relative flex min-h-[calc(100vh-4rem)] flex-grow items-center justify-center overflow-hidden px-6 sm:px-4'>
			<Div className='relative mx-auto w-full max-w-7xl'>
				<Div className='absolute -left-0 top-1/3 z-10 mx-auto w-full max-w-2xl -translate-y-1/3'>
					<Typography variant='h2' className='mb-4 leading-tight'>
						Simplify Warehouse Management with i-WMS
					</Typography>

					<Typography variant='p' className='mb-12 leading-relaxed tracking-wide xl:text-lg'>
						Improve inventory visibility, automate warehouse processes, and boost productivity with i-WMS.
						<br className='hidden xxl:block' /> Our comprehensive system provides the tools you need to manage
						your warehouse effortlessly.
					</Typography>

					<Div className='flex items-center gap-x-1'>
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
				<Div className='bg-gradient'>
					<Image src={HeroImage} />
				</Div>
			</Div>
		</Div>
	)
}

const Image = tw.img`h-full xxl:max-w-4xl xl:max-w-2xl object-contain xl:-translate-y-4 xl:translate-x-[80%] xxl:translate-x-[50%] rotate-[20deg] translate-y-8 -skew-x-[32deg] skew-y-0 dark:opacity-40 opacity-80 [&:not(:root)]:overflow-hidden drop-shadow-xl`
