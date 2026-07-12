import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@common/utils/cn'

const Breadcrumb: React.FC<
	React.ComponentProps<'nav'> & {
		separator?: React.ReactNode
	}
> = ({ ...props }) => <nav aria-label='breadcrumb' {...props} />
Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList: React.FC<React.ComponentProps<'ol'>> = ({ className, ...props }) => (
	<ol
		className={cn(
			'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
			className
		)}
		{...props}
	/>
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem: React.FC<React.ComponentProps<'li'>> = ({ className, ...props }) => (
	<li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink: React.FC<
	React.ComponentProps<'a'> & {
		asChild?: boolean
	}
> = ({ asChild, className, ...props }) => {
	const Comp = asChild ? Slot : 'a'

	return <Comp className={cn('transition-colors hover:text-foreground', className)} {...props} />
}
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage: React.FC<React.ComponentProps<'span'>> = ({ className, ...props }) => (
	<span
		role='link'
		aria-disabled='true'
		aria-current='page'
		className={cn('font-normal text-foreground', className)}
		{...props}
	/>
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
	<li role='presentation' aria-hidden='true' className={cn('[&>svg]:size-3.5', className)} {...props}>
		{children ?? <ChevronRightIcon />}
	</li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span
		role='presentation'
		aria-hidden='true'
		className={cn('flex h-9 w-9 items-center justify-center', className)}
		{...props}>
		<DotsHorizontalIcon className='h-4 w-4' />
		<span className='sr-only'>More</span>
	</span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis'

export {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
}
