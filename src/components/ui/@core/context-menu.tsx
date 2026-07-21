import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons'
import * as React from 'react'

import { cn } from '@common/utils/cn'

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger: React.FC<
	React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
		inset?: boolean
	}
> = ({ className, inset, children, ...props }) => (
	<ContextMenuPrimitive.SubTrigger
		className={cn(
			'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
			inset && 'pl-8',
			className
		)}
		{...props}>
		{children}
		<ChevronRightIcon className='ml-auto h-4 w-4' />
	</ContextMenuPrimitive.SubTrigger>
)
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent: React.FC<React.ComponentProps<typeof ContextMenuPrimitive.SubContent>> = ({
	className,
	...props
}) => (
	<ContextMenuPrimitive.SubContent
		className={cn(
			'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg',
			className
		)}
		{...props}
	/>
)
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent: React.FC<React.ComponentProps<typeof ContextMenuPrimitive.Content>> = ({
	className,
	...props
}) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			className={cn(
				'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md',
				className
			)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
)
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem: React.FC<
	React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
		inset?: boolean
	}
> = ({ className, inset, ...props }) => (
	<ContextMenuPrimitive.Item
		className={cn(
			'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
			inset && 'pl-8',
			className
		)}
		{...props}
	/>
)
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem: React.FC<React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>> = ({
	className,
	children,
	checked,
	...props
}) => (
	<ContextMenuPrimitive.CheckboxItem
		className={cn(
			'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
			className
		)}
		checked={checked}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<CheckIcon className='h-4 w-4' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.CheckboxItem>
)
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem: React.FC<React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>> = ({
	className,
	children,
	...props
}) => (
	<ContextMenuPrimitive.RadioItem
		className={cn(
			'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
			className
		)}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<DotFilledIcon className='h-4 w-4 fill-current' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.RadioItem>
)
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel: React.FC<
	React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
		inset?: boolean
	}
> = ({ className, inset, ...props }) => (
	<ContextMenuPrimitive.Label
		className={cn('text-foreground px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
		{...props}
	/>
)
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator: React.FC<React.ComponentProps<typeof ContextMenuPrimitive.Separator>> = ({
	className,
	...props
}) => <ContextMenuPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger
}
