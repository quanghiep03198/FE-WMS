import { Div, Icon, Typography } from '@/components/ui'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'

const SupportSection: React.FunctionComponent = () => {
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div
			ref={ref}
			id='cta'
			as='section'
			className='max-w-7xl animate-[fly-in_1s_ease] space-y-8 xl:space-y-16'
			style={{
				animationFillMode: 'both',
				animationPlayState: inViewport ? 'running' : 'paused'
			}}>
			<Div className='space-y-4 text-center'>
				<Typography variant='h3' className='sm:text-xl'>
					Contact support
				</Typography>
				<Typography variant='p' className='sm:text-sm xl:text-lg'>
					If you encounter any issues while using the application, don&apos;t hesitate to reach out for assistance.
				</Typography>
			</Div>
			<Div className='flex gap-x-6'>
				<Div className='grid size-12 place-content-center rounded-lg bg-secondary'>
					<Icon name='Bug' size={24} strokeWidth={1.5} aria-hidden='true' />
				</Div>
				<Div>
					<Typography variant='h6' className='mb-1 text-base sm:text-sm'>
						Bug reports
					</Typography>
					<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
						Notice something not working right? Please let us know about any bugs you find so we can fix them
						promptly.
					</Typography>

					<a
						href='https://forms.gle/7Bes5qhm2AGPxhQ36'
						target='_blank'
						className='inline-flex items-center gap-x-2 text-sm font-medium text-primary underline-offset-4 hover:underline'
						rel='noreferrer'>
						Report a bug <Icon name='ArrowRight' size={12} />
					</a>
				</Div>
			</Div>
			<Div className='flex gap-x-6'>
				<Div className='grid size-12 place-content-center rounded-lg bg-accent'>
					<Icon name='Computer' size={24} strokeWidth={1.5} aria-hidden='true' />
				</Div>
				<Div>
					<Typography variant='h6' className='mb-1 text-base sm:text-sm'>
						Technical support
					</Typography>
					<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
						For additional technical assistance, our support team is here to help. Contact us for any technical
						issues or questions.
					</Typography>
					<a
						href='#wechat'
						className='inline-flex items-center gap-x-2 text-sm font-medium text-primary underline-offset-4 hover:underline'>
						Join our WeChat <Icon name='ArrowRight' size={12} />
					</a>
				</Div>
			</Div>
		</Div>
	)
}

export default SupportSection
