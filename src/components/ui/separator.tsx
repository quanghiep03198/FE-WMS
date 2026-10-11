import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

import { cn } from '@common/utils/cn'

const Separator: React.FC<React.ComponentProps<typeof SeparatorPrimitive.Root>> = ({
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}) => (
	<SeparatorPrimitive.Root
		className={cn('bg-border shrink-0', orientation === 'horizontal' ? 'h-px w-full' : 'min-h-full w-px', className)}
		decorative={decorative}
		orientation={orientation}
		{...props}
	/>
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
