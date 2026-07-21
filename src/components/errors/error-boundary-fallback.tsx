import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Separator,
	Typography
} from '@/components/ui'
import type { FallbackRender } from '@sentry/react'
import { captureException } from '@sentry/react'
import React, { useEffect } from 'react'

import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import FeedbackFormTrigger from '@/components/ui/@sentry/feedback-form-trigger'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'
import InternalServerError from './internal-server-error'

interface ErrorBoundaryFallbackProps extends Partial<Parameter<FallbackRender>> {
	error: Error
	resetError: (...args: any[]) => void
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
	error,
	resetError
}): React.ReactElement => {
	const { t } = useTranslation()

	useEffect(() => {
		captureException(error)
	}, [error])

	return (
		<Div className='grid min-h-(--outlet-wrapper-height,100vh) w-full place-items-center gap-y-6 @3xl:grid-cols-[1fr_1.5fr] @5xl:grid-cols-2'>
			<Div className='mx-auto flex max-w-3xl flex-col items-start gap-y-3'>
				<Div className='flex items-center gap-x-4'>
					<Typography color='destructive' className='font-semibold'>
						{HttpStatusCode.InternalServerError}
					</Typography>
					<Separator orientation='vertical' className='h-5 w-0.5' />
					<Typography variant='h4'>{t('ns_common:errors.500')}</Typography>
				</Div>
				<Typography color='muted' className='text-pretty'>
					{t('ns_common:errors.500_message')}
				</Typography>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='link' className='p-0'>
							Show error details
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-4xl'>
						<DialogHeader>
							<DialogTitle className='text-destructive'>Error</DialogTitle>
						</DialogHeader>
						<ScrollShadow className='max-h-96 scrollbar-none!'>
							<Typography color='muted' className='font-medium'>
								{error?.stack}
							</Typography>
						</ScrollShadow>
					</DialogContent>
				</Dialog>
				<Div className='mt-6 inline-grid grid-cols-2 gap-x-2'>
					<Button onClick={() => resetError()}>{t('ns_common:actions.retry')}</Button>
					<FeedbackFormTrigger variant='secondary' />
				</Div>
			</Div>
			<InternalServerError className='hidden h-full w-full @3xl:block' />
		</Div>
	)
}
