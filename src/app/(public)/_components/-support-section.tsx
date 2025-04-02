import useTheme from '@/common/hooks/use-theme'
import { Div, Icon, Typography } from '@/components/ui'
import FeedbackFormTrigger from '@/components/ui/@sentry/feedback-form-trigger'
import { useInViewport } from 'ahooks'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../_contexts/-page-context'

const SupportSection: React.FunctionComponent = () => {
	const ref = useRef<HTMLDivElement>(null)
	const { theme } = useTheme()
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})

	return (
		<Div className='grid grid-cols-2 items-center justify-center gap-16 sm:grid-cols-1 md:grid-cols-1'>
			<Image src={theme === 'dark' ? '/shipping-dark.svg' : '/shipping-light.svg'} className='' />
			<Div
				ref={ref}
				id='cta'
				as='section'
				className='animate-[fly-in_1s_ease] space-y-8 xl:space-y-12'
				style={{
					animationFillMode: 'both',
					animationPlayState: inViewport ? 'running' : 'paused'
				}}>
				<Div className='space-y-3 text-left'>
					<Typography variant='h3' className='sm:text-center sm:text-xl'>
						Contact support
					</Typography>
					<Typography variant='p' className='text-pretty sm:text-center sm:text-sm xl:text-lg'>
						If you encounter any issues while using the application, don&apos;t hesitate to reach out for
						assistance.
					</Typography>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-lg bg-accent'>
						<Icon
							name='Bug'
							size={24}
							strokeWidth={1.5}
							aria-hidden='true'
							className='transition-colors duration-200 group-hover/support:stroke-destructive'
						/>
					</Div>
					<Div>
						<Typography variant='h6' className='mb-1 text-base sm:text-sm'>
							Bug reports
						</Typography>
						<Typography variant='p' color='muted' className='mb-3 leading-7 sm:text-sm'>
							Notice something not working right? Please let us know about any bugs you find so we can fix them
							promptly.
						</Typography>
						<FeedbackFormTrigger />
					</Div>
				</Div>
				<Div className='group/support flex gap-x-6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-lg bg-accent'>
						<Icon
							name='Computer'
							size={24}
							strokeWidth={1.5}
							aria-hidden='true'
							className='transition-colors duration-200 group-hover/support:stroke-[var(--primary-alt)]'
						/>
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
		</Div>
	)
}

const Image = tw.img`max-w-2xl object-contain object-center sm:order-last md:order-last sm:max-w-full`

export default SupportSection
