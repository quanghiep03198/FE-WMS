import { Div, DivProps } from '@/components/ui'
import React, { memo } from 'react'

export const TableHeadCaption: React.FC<DivProps & React.PropsWithChildren> = memo(
	({ children, ...props }) => {
		return (
			<Div
				{...props}
				className='sticky top-0 z-20 flex h-10 translate-y-[0.5px] items-center rounded-t-[inherit] border-b bg-background px-4 text-center text-sm font-medium text-muted-foreground'>
				{props['aria-description']}
			</Div>
		)
	},
	(prev, next) => prev['aria-description'] === next['aria-description']
)
