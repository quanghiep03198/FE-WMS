import { cn } from '@/common/utils/cn'
import * as React from 'react'

export type InputProps = React.ComponentProps<'input'>

const Input: React.FC<InputProps> = ({ className, type, ref, ...props }) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-within:border-primary focus:outline-none disabled:text-muted-foreground',
				className
			)}
			ref={ref}
			{...props}
		/>
	)
}

Input.displayName = 'Input'

export { Input }
