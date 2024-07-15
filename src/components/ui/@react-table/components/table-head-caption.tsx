import React, { memo } from 'react'
import { Div, DivProps } from '@/components/ui'

export const TableHeadCaption: React.FC<DivProps & React.PropsWithChildren> = memo(
	({ children, ...props }) => {
		return (
			<Div
				{...props}
				className='flex h-9 items-center bg-accent px-4 text-center text-sm font-medium text-accent-foreground'>
				{props['aria-description']}
			</Div>
		)
	},
	(prev, next) => prev['aria-description'] === next['aria-description']
)
