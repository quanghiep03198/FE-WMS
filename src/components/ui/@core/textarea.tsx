import * as React from 'react'

import { cn } from '@common/utils/cn'

const Textarea: React.FC<React.ComponentProps<'textarea'>> = ({ className, ...props }) => {
	return (
		<textarea
			className={cn(
				'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		/>
	)
}
Textarea.displayName = 'Textarea'

export { Textarea }
