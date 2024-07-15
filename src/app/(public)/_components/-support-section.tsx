import env from '@/common/utils/env'
import { Div, Icon, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { memo, useRef } from 'react'
import { useScrollIntoView } from '..'

const SupportSection: React.FunctionComponent = () => {
	const sectionRef = useRef<HTMLDivElement>(null)

	useScrollIntoView({ hashMatch: 'support', target: sectionRef.current })

	return (
		<Div ref={sectionRef} as='section' className='relative flex flex-grow items-center justify-center px-6 sm:px-4'>
			<Div className='mt-20 max-w-7xl space-y-16'>
				<Div className='space-y-4 text-center'>
					<Typography variant='h3'>Contact support</Typography>
					<Typography variant='p' className='xl:text-lg'>
						If you encounter any issues while using the application, don't hesitate to reach out for assistance.
					</Typography>
				</Div>
				<Div className='flex gap-x-6'>
					<Div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
						<Icon name='Bug' size={20} strokeWidth={1.5} stroke='hsl(var(--primary))' aria-hidden='true' />
					</Div>
					<Div>
						<Typography variant='h6' className='mb-1 text-base'>
							Bug reports
						</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7'>
							Notice something not working right? Please let us know about any bugs you find so we can fix them
							promptly.
						</Typography>

						<a
							href={env('VITE_REPORT_BUG_URL')}
							target='_blank'
							className='inline-flex items-center gap-x-2 text-sm font-medium text-primary underline-offset-4 hover:underline'>
							Report a bug <Icon name='ArrowRight' size={12} />
						</a>
					</Div>
				</Div>
				<Div className='flex gap-x-6'>
					<Div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 '>
						<Icon name='Computer' size={20} strokeWidth={1.5} stroke='hsl(var(--primary))' aria-hidden='true' />
					</Div>
					<Div>
						<Typography variant='h6' className='mb-1 text-base'>
							Technical support
						</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7'>
							For additional technical assistance, our support team is here to help. Contact us for any technical
							issues or questions.
						</Typography>
						<Link
							href='/'
							className='inline-flex items-center gap-x-2 text-sm font-medium text-primary underline-offset-4 hover:underline'>
							Join our WeChat <Icon name='ArrowRight' size={12} />
						</Link>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default memo(SupportSection)
