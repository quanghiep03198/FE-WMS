import { cn } from '@/common/utils/cn'
import React from 'react'

const Skeleton: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<div
			{...props}
			style={{
				...props.style,
				willChange: 'background-position'
			}}
			className={cn(
				'min-h-3 w-full animate-shimmer rounded-[2px] bg-[linear-gradient(90deg,#e5e5e5,15%,#f5f5f5,85%,#e5e5e5)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,#171717,15%,#262626,85%,#171717)]',
				className
			)}
		/>
	)
}

export default Skeleton
