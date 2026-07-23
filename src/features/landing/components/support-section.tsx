import GridBackground from '@components/shared/grid-background'
import { Div, Icon, Typography } from '@components/ui'
import FeedbackFormTrigger from '@components/ui/@sentry/feedback-form-trigger'
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
			id='support'
			as='section'
			ref={ref}
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}
			className='animate-in fade-in-0 slide-in-from-bottom-4 relative w-full border-y px-3 py-10 duration-700 xl:px-0'>
			<GridBackground className='absolute inset-0 z-[-1] mask-[radial-gradient(50%_100%_at_top_center,white,transparent)]' />
			<Div className='mx-auto my-20 w-full max-w-3xl gap-10 space-y-8 pb-10 xl:space-y-12'>
				<Div className='relative space-y-3 overflow-hidden text-center'>
					<Typography variant='h1'>Contact support</Typography>
					<Typography variant='p' className='text-pretty xl:text-lg'>
						If you encounter any issues while using the application, don&apos;t hesitate to reach out for
						assistance.
					</Typography>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							name='MessagesSquare'
							size={24}
							strokeWidth={1.5}
							aria-hidden='true'
							className='group-hover/support:stroke-active transition-colors duration-200'
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Connectivity support</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
							Experiencing connectivity issues? Our support team is ready to assist you with any network-related
							problems you may encounter.
						</Typography>
						<a
							href='#chat'
							className='text-primary inline-flex items-center gap-x-2 text-sm font-medium underline-offset-4 hover:underline'>
							{`Let's talk`} <Icon name='ArrowRight' size={12} />
						</a>
					</Div>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							name='Bug'
							size={24}
							strokeWidth={1.5}
							aria-hidden='true'
							className='group-hover/support:stroke-destructive transition-colors duration-200'
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Bug reports</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
							Notice something not working right? Please let us know about any bugs you find so we can fix them
							promptly.
						</Typography>
						<FeedbackFormTrigger variant='link' className='p-0'>
							Report bug
							<Icon name='ArrowRight' size={12} />
						</FeedbackFormTrigger>
					</Div>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='bg-accent grid aspect-square size-12 place-content-center rounded-lg'>
						<Icon
							name='Computer'
							size={24}
							strokeWidth={1.5}
							aria-hidden='true'
							className='transition-colors duration-200 group-hover/support:stroke-(--primary-alt)'
						/>
					</Div>
					<Div>
						<Typography className='mb-1 text-base font-medium sm:text-sm'>Technical support</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
							For additional technical assistance, our support team is here to help. Contact us for any technical
							issues or questions.
						</Typography>
						<a
							href='#wechat'
							className='text-primary inline-flex items-center gap-x-2 text-sm font-medium underline-offset-4 hover:underline'>
							Join our WeChat <Icon name='ArrowRight' size={12} />
						</a>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default SupportSection
