import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import FeedbackFormTrigger from '@components/shared/feedback-form-trigger'
import { Button } from '@components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { Separator } from '@components/ui/separator'
import type { FallbackRender } from '@sentry/react'
import { captureException } from '@sentry/react'
import { HttpStatusCode } from 'axios'
import React, { useEffect } from 'react'
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
					<Typography className='font-semibold' color='destructive'>
						{HttpStatusCode.InternalServerError}
					</Typography>
					<Separator className='h-5 w-0.5' orientation='vertical' />
					<Typography variant='h4'>{t('ns_common:errors.500')}</Typography>
				</Div>
				<Typography className='text-pretty' color='muted'>
					{t('ns_common:errors.500_message')}
				</Typography>
				<Dialog>
					<DialogTrigger asChild>
						<Button className='p-0' variant='link'>
							Show error details
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-4xl'>
						<DialogHeader>
							<DialogTitle className='text-destructive'>Error</DialogTitle>
						</DialogHeader>
						<Div className='scroll-fade max-h-96 scrollbar-none!'>
							<Typography className='font-medium' color='muted'>
								{error?.stack}
							</Typography>
						</Div>
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
