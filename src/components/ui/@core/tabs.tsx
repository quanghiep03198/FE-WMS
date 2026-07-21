import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@common/utils/cn'

const Tabs = TabsPrimitive.Root

const TabsList: React.FC<React.ComponentProps<typeof TabsPrimitive.List>> = ({ className, ...props }) => (
	<TabsPrimitive.List
		className={cn(
			'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
			className
		)}
		{...props}
	/>
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger: React.FC<React.ComponentProps<typeof TabsPrimitive.Trigger>> = ({ className, ...props }) => (
	<TabsPrimitive.Trigger
		className={cn(
			'ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow',
			className
		)}
		{...props}
	/>
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent: React.FC<React.ComponentProps<typeof TabsPrimitive.Content>> = ({ className, ...props }) => (
	<TabsPrimitive.Content
		className={cn(
			'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
			className
		)}
		{...props}
	/>
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
