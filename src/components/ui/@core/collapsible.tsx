import { cn } from '@common/utils/cn'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent: React.FC<React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>> = ({
	className,
	...props
}) => (
	<CollapsiblePrimitive.CollapsibleContent
		{...props}
		className={cn(
			'transition-allow-discrete data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
			className
		)}
	/>
)

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
