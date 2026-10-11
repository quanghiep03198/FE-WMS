import { cn } from '@common/utils/cn'
import React from 'react'

const Skeleton: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<div
			{...props}
			className={cn(
				'animate-shimmer min-h-3 w-full rounded-[2px] bg-[linear-gradient(90deg,#e5e5e5,15%,#f5f5f5,85%,#e5e5e5)] bg-size-[200%_100%] will-change-[background-position] dark:bg-[linear-gradient(90deg,#171717,15%,#262626,85%,#171717)]',
				className
			)}
		/>
	)
}

export default Skeleton
