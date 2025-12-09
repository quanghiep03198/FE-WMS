import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
import React from 'react'

const PlaceHolderItems: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div {...props} className={cn('relative grid h-28 w-full place-content-center place-items-center', className)}>
			<PlaceholderItem className='absolute top-0 z-20' />
			<PlaceholderItem className='absolute top-6 z-10 scale-[85%] opacity-80' />
			<PlaceholderItem className='absolute top-12 z-0 scale-[70%] opacity-60' />
		</Div>
	)
}

const PlaceholderItem: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div
			className={cn(
				'flex w-full max-w-48 items-center gap-x-4 rounded-md border bg-background p-2 shadow-md',
				className
			)}
			{...props}>
			<Div className='aspect-square size-8 rounded bg-accent' />
			<Div className='flex-1 space-y-2'>
				<Div className='aspect-square h-3 w-full rounded bg-accent' />
				<Div className='aspect-square h-3 w-2/3 rounded bg-accent' />
			</Div>
		</Div>
	)
}

export default PlaceHolderItems
