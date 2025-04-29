import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Typography
} from '@/components/ui'
import { captureException, FallbackRender } from '@sentry/react'
import React, { useEffect } from 'react'

import env from '@/common/utils/env'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import FeedbackFormTrigger from '@/components/ui/@sentry/feedback-form-trigger'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'
import InternalServerError from './-internal-server-error'

interface ErrorBoundaryFallbackProps extends Partial<Parameter<FallbackRender>> {
	error: Error
	resetError: (...args: any[]) => void
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
	error,
	eventId,
	resetError
}): React.ReactElement => {
	const { t } = useTranslation()
	const isDevelopment = env<RuntimeEnvironment>('VITE_NODE_ENV') === 'development'

	useEffect(() => {
		captureException(error)
	}, [error])

	return (
		<Div className='mx-auto flex h-full min-h-[var(--outlet-wrapper-height)] max-w-7xl flex-col items-center gap-10 *:flex-1 @5xl:flex-row xxl:max-w-8xl'>
			<Div className='flex flex-col items-center gap-y-3 @5xl:items-start'>
				<Typography variant='code' className='text-lg font-semibold' color='destructive'>
					{HttpStatusCode.InternalServerError}
				</Typography>
				<Typography variant='h2'>{t('ns_common:errors.500')}</Typography>
				<Typography color='muted' className='text-center @5xl:text-left'>
					{t('ns_common:errors.500_message')}
				</Typography>
				{isDevelopment && (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='link' size='lg' className='w-full p-0 text-base @5xl:w-auto'>
								Show error details
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-4xl'>
							<DialogHeader>
								<DialogTitle className='text-destructive'>Error</DialogTitle>
							</DialogHeader>
							<ScrollShadow className='max-h-96 !scrollbar-none'>
								<Typography color='muted' className='font-medium'>
									{error?.stack}
								</Typography>
							</ScrollShadow>
						</DialogContent>
					</Dialog>
				)}
				<Div className='mt-6 inline-grid grid-cols-2 gap-x-2'>
					<Button onClick={() => resetError()}>{t('ns_common:actions.retry')}</Button>
					<FeedbackFormTrigger />
				</Div>
			</Div>

			<InternalServerError className='h-full w-full' />
		</Div>
	)
}
