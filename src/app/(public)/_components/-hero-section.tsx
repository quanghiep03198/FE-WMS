import { cn } from '@/common/utils/cn';
import { Div, Icon, Typography, buttonVariants } from '@/components/ui';
import { Link } from '@tanstack/react-router';

export default function HeroSection() {
	return (
		<Div as='section' className='relative flex min-h-[calc(100vh-4rem)] flex-grow items-center justify-center px-6 sm:px-4'>
			<Div className='mx-auto max-w-7xl space-y-6'>
				<Div className='text-center'>
					<Typography variant='h2' className='mb-6 leading-tight'>
						Simplify Warehouse Management with i-WMS
					</Typography>

					<Typography variant='p' className='mb-10 xl:text-lg'>
						Improve inventory visibility, automate warehouse processes, and boost productivity with StockMaster.
						<br className='sm:hidden md:hidden' /> Our comprehensive system provides the tools you need to manage your warehouse effortlessly.
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
			</Div>
		</Div>
	);
}
