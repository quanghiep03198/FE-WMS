import { cn } from '@/common/utils/cn'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
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
})

Input.displayName = 'Input'

export { Input }
