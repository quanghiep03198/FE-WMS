import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
import React from 'react'

const PlaceHolderItems: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div {...props} className={cn('relative grid h-28 w-full place-content-center place-items-center', className)}>
			<PlaceholderItem className='absolute top-0 z-20 dark:brightness-95' />
			<PlaceholderItem className='absolute top-6 z-10 scale-[0.8] dark:brightness-75' />
			<PlaceholderItem className='absolute top-12 z-0 scale-[0.6] dark:brightness-50' />
		</Div>
	)
}

const PlaceholderItem: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div
			className={cn(
				'grid w-full max-w-48 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 rounded-md border bg-background p-2 shadow-md',
				className
			)}
			{...props}>
			<Div className='col-start-1 row-span-2 aspect-square size-8 rounded bg-accent' />
			<Div className='col-start-2 row-start-1 aspect-square h-3 w-full rounded bg-accent' />
			<Div className='col-start-2 row-start-2 aspect-square h-3 w-2/3 rounded bg-accent' />
		</Div>
	)
}

export default PlaceHolderItems
