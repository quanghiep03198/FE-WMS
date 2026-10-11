import { cn } from '@common/utils/cn'
import React from 'react'

interface StatusIndicatorProps {
	state: 'active' | 'down' | 'fixing' | 'idle'
	label?: string
	className?: string
	size?: 'sm' | 'md' | 'lg'
	labelClassName?: string
}

const getStateColors = (state: StatusIndicatorProps['state']) => {
	switch (state) {
		case 'active':
			return { dot: 'bg-success', ping: 'bg-success' }
		case 'down':
			return { dot: 'bg-destructive', ping: 'bg-destructive' }
		case 'fixing':
			return { dot: 'bg-warning', ping: 'bg-warning' }
		case 'idle':
		default:
			return { dot: 'bg-muted-foreground', ping: 'bg-muted-foreground' }
	}
}

const getSizeClasses = (size: StatusIndicatorProps['size']) => {
	switch (size) {
		case 'sm':
			return { dot: 'h-2 w-2', ping: 'h-2 w-2' }
		case 'lg':
			return { dot: 'h-4 w-4', ping: 'h-4 w-4' }
		case 'md':
		default:
			return { dot: 'h-3 w-3', ping: 'h-3 w-3' }
	}
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
	state = 'idle',
	label,
	className,
	size = 'md',
	labelClassName
}) => {
	const shouldAnimate = state === 'active' || state === 'fixing' || state === 'down'
	const colors = getStateColors(state)
	const sizeClasses = getSizeClasses(size)

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<div className='relative flex items-center'>
				{shouldAnimate && (
					<span
						className={cn(
							'absolute inline-flex animate-ping rounded-full opacity-75',
							sizeClasses.ping,
							colors.ping
						)}
					/>
				)}
				<span className={cn('relative inline-flex rounded-full', sizeClasses.dot, colors.dot)} />
			</div>
			{label && <p className={cn('text-foreground text-sm', labelClassName)}>{label}</p>}
		</div>
	)
}
