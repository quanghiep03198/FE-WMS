import env from '@/common/utils/env'
import { Div, Icon, Typography } from '@/components/ui'
import { memo } from 'react'

const SupportSection: React.FunctionComponent = () => {
	return (
		<Div id='cta' as='section' className='max-w-7xl space-y-8 xl:space-y-16'>
			<Div className='space-y-4 text-center'>
				<Typography variant='h3' className='sm:text-xl'>
					Contact support
				</Typography>
				<Typography variant='p' className='sm:text-sm xl:text-lg'>
					If you encounter any issues while using the application, don't hesitate to reach out for assistance.
				</Typography>
			</Div>
			<Div className='flex gap-x-6'>
				<Div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
					<Icon name='Bug' size={20} strokeWidth={1.5} stroke='hsl(var(--primary))' aria-hidden='true' />
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
						href={env('VITE_REPORT_BUG_URL', '#')}
						target='_blank'
						className='inline-flex items-center gap-x-2 text-sm font-medium text-primary underline-offset-4 hover:underline'>
						Report a bug <Icon name='ArrowRight' size={12} />
					</a>
				</Div>
			</Div>
			<Div className='flex gap-x-6'>
				<Div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 '>
					<Icon name='Computer' size={20} strokeWidth={1.5} stroke='hsl(var(--primary))' aria-hidden='true' />
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

export default memo(SupportSection)
