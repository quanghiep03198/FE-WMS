import { Div, Icon, Typography, buttonVariants } from '@/components/ui'
import { Link } from '@tanstack/react-router'

export default function NotFoundPage() {
	return (
		<Div className='grid min-h-screen place-items-center px-6 py-24 sm:py-32 xl:px-8'>
			<Div className='text-center'>
				<Typography variant='code' color='primary' className='text-base font-semibold'>
					404
				</Typography>
				<Typography variant='h2' className='mt-4'>
					Page not found
				</Typography>
				<Typography variant='p' className='mt-6 text-base leading-7' color='muted'>
					Sorry, we couldn’t find the page you’re looking for.
				</Typography>
				<Div className='mt-10 flex items-center justify-center gap-x-1'>
					<Link to='/' className={buttonVariants({ variant: 'default' })}>
						Go back home
					</Link>
					<Link
						to='/'
						className={buttonVariants({
							variant: 'link',
							className: 'gap-x-2 text-foreground'
						})}>
						Contact support <Icon name='ArrowRight' size={12} />
					</Link>
				</Div>
			</Div>
		</Div>
	)
}
