import FeedbackFormTrigger from '@components/shared/feedback-form-trigger'
import GridBackground from '@components/shared/grid-background'
import { Div, Icon, Typography } from '@components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../contexts/page-context'

const SupportSection: React.FunctionComponent = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div
			as='section'
			className='animate-in fade-in-0 slide-in-from-bottom-4 relative w-full border-y px-3 py-10 duration-700 xl:px-0'
			id='support'
			ref={ref}
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<GridBackground className='absolute inset-0 z-[-1] mask-[radial-gradient(50%_100%_at_top_center,white,transparent)]' />
			<Div className='mx-auto my-20 w-full max-w-3xl gap-10 space-y-8 pb-10 xl:space-y-12'>
				<Div className='relative space-y-3 overflow-hidden text-center'>
					<Typography variant='h1'>Contact support</Typography>
					<Typography className='text-pretty xl:text-lg' variant='p'>
						If you encounter any issues while using the application, don&apos;t hesitate to reach out for
						assistance.
					</Typography>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							aria-hidden='true'
							className='group-hover/support:stroke-active transition-colors duration-200'
							name='MessagesSquare'
							size={24}
							strokeWidth={1.5}
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Connectivity support</Typography>
						<Typography className='mb-3 leading-7 sm:text-sm' color='muted' variant='p'>
							Experiencing connectivity issues? Our support team is ready to assist you with any network-related
							problems you may encounter.
						</Typography>
						<a
							className='text-primary inline-flex items-center gap-x-2 text-sm font-medium underline-offset-4 hover:underline'
							href='#chat'>
							{`Let's talk`} <Icon name='ArrowRight' size={12} />
						</a>
					</Div>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							aria-hidden='true'
							className='group-hover/support:stroke-destructive transition-colors duration-200'
							name='Bug'
							size={24}
							strokeWidth={1.5}
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Bug reports</Typography>
						<Typography className='mb-3 leading-7 sm:text-sm' color='muted' variant='p'>
							Notice something not working right? Please let us know about any bugs you find so we can fix them
							promptly.
						</Typography>
						<FeedbackFormTrigger className='p-0' variant='link'>
							Report bug
							<Icon name='ArrowRight' size={12} />
						</FeedbackFormTrigger>
					</Div>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							aria-hidden='true'
							className='transition-colors duration-200 group-hover/support:stroke-(--primary-alt)'
							name='Computer'
							size={24}
							strokeWidth={1.5}
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Technical support</Typography>
						<Typography className='mb-3 leading-7 sm:text-sm' color='muted' variant='p'>
							For additional technical assistance, our support team is here to help. Contact us for any technical
							issues or questions.
						</Typography>
						<a
							className='text-primary inline-flex items-center gap-x-2 text-sm font-medium underline-offset-4 hover:underline'
							href='#wechat'>
							Join our WeChat <Icon name='ArrowRight' size={12} />
						</a>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default SupportSection
