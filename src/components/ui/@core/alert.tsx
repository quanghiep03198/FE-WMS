import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@common/utils/cn'

const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				destructive:
					'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-background/90 backdrop-blur-sm'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

const Alert: React.FC<React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>> = ({
	className,
	variant,
	...props
}) => <div role='alert' className={cn(alertVariants({ variant }), className)} {...props} />
Alert.displayName = 'Alert'

const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
	<h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
	<div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertDescription, AlertTitle }
