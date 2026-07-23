import type { DivProps } from '@components/ui'
import { Div } from '@components/ui'
import { cn } from '@common/utils/cn'
import React from 'react'

const AnimatedBorderCard: React.FC<DivProps> = ({ className, children, ...props }) => {
	return (
		<Div
			{...props}
			className={cn(
				'bg-border relative flex aspect-square items-center justify-center overflow-hidden rounded-md p-px before:absolute before:top-[-25%] before:left-[-25%] before:h-[150%] before:w-[150%] before:animate-[spin_5s_linear_infinite] before:bg-[conic-gradient(transparent_45deg,transparent,var(--primary-alt))] before:content-[""]',
				className
			)}>
			<Div className='bg-popover z-10 grid aspect-square h-full w-full flex-1 basis-full place-content-center rounded-[inherit]'>
				{children}
			</Div>
		</Div>
	)
}

export default AnimatedBorderCard
