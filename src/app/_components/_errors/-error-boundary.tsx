import { cn } from '@/common/utils/cn'
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Div,
	Icon,
	ScrollArea,
	ScrollBar,
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
	const [open, setOpen] = useState<boolean>(true)

	return (
		<Div role='alert' className='flex w-full max-w-full items-start gap-x-6 overflow-hidden'>
			<Div className='inline-flex items-center justify-center rounded-full bg-destructive/20 p-4'>
				<Icon name='Bug' stroke='hsl(var(--destructive))' strokeWidth={1.5} size={28} aria-hidden='true' />
			</Div>
			<Div>
				<Typography variant='h6' color='destructive' className='mb-2'>
					Something went wrong
				</Typography>
				<Typography variant='p' className='mb-2'>
					"{error.message}"
				</Typography>
				<Collapsible open={open} onOpenChange={setOpen} className='mb-6'>
					<CollapsibleTrigger
						className={cn(buttonVariants({ variant: 'link', className: 'gap-x-2 px-0 text-foreground' }))}>
						<Typography variant='small' className='basis-16'>
							{open ? 'Hide' : 'Show'}
						</Typography>
						<Icon name={open ? 'EyeOff' : 'Eye'} size={24} />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<ScrollArea className='max-h-64 w-full'>
							<Typography variant='p' color='muted'>
								{error.stack}
							</Typography>
							<ScrollBar orientation='horizontal' />
						</ScrollArea>
					</CollapsibleContent>
				</Collapsible>
				<Button variant='destructive' onClick={resetBoundary}>
					Try again
				</Button>
			</Div>
		</Div>
	)
}

export default ErrorBoundary
