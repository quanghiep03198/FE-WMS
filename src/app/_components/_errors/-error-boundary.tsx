import { cn } from '@/common/utils/cn'
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Div,
	Icon,
	Typography,
	buttonVariants
} from '@/components/ui'
import React, { useState } from 'react'
import { ErrorBoundary as ReactErrorBoundary, useErrorBoundary } from 'react-error-boundary'

const ErrorBoundary: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<ReactErrorBoundary FallbackComponent={ErrorFallback} onError={(error, info) => console.log({ error, info })}>
			{children}
		</ReactErrorBoundary>
	)
}

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
	const { resetBoundary } = useErrorBoundary()
	const [open, setOpen] = useState<boolean>(false)

	return (
		<Div role='alert' className='mx-auto flex h-full w-full max-w-full flex-grow flex-col items-center space-y-4'>
			<Div className='flex w-full items-start gap-x-6'>
				<Div className='inline-flex items-center justify-center rounded-full bg-destructive/20 p-4'>
					<Icon name='Bug' stroke='hsl(var(--destructive))' strokeWidth={1.5} size={32} aria-hidden='true' />
				</Div>
				<Div>
					<Typography variant='h6' color='destructive' className='mb-2'>
						Something went wrong
					</Typography>
					<Typography variant='p' className='mb-6'>
						"{error.message}"
					</Typography>

					<Div className='mb-6'>
						<Typography
							variant='p'
							className={cn('inline-block', open ? 'line-clamp-none' : 'line-clamp-3')}
							color='muted'>
							{error.stack}
						</Typography>
						<Button variant='link' className='px-0 text-foreground' onClick={() => setOpen(!open)}>
							{open ? 'Show less' : 'Show more'}
						</Button>
					</Div>

					<Button variant='destructive' onClick={resetBoundary}>
						Try again
					</Button>
				</Div>
			</Div>
		</Div>
	)
}

export default ErrorBoundary
