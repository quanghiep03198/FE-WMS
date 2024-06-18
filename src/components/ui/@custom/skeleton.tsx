import { cn } from '@/common/utils/cn'
import React from 'react'

const Skeleton: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<div
			{...props}
			className={cn(
				'min-h-3 w-full animate-shimmer rounded-[2px] bg-[linear-gradient(120deg,hsl(var(--secondary)),45%,hsl(var(--background)),55%,hsl(var(--secondary)))] bg-[length:200%_100%] dark:bg-[linear-gradient(120deg,hsl(var(--muted)),45%,hsl(var(--muted-foreground)),55%,hsl(var(--muted)))]',
				className
			)}
		/>
	)
}

export default Skeleton
