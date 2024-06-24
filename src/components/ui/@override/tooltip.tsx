import React from 'react'
import { Tooltip as TooltipWrapper, TooltipProvider, TooltipTrigger, TooltipContent } from '../@core/tooltip'
import { cn } from '@/common/utils/cn'

type TooltipProps = {
	message: string
	triggerProps?: React.ComponentProps<typeof TooltipTrigger>
	providerProps?: React.ComponentProps<typeof TooltipProvider>
	contentProps?: React.ComponentProps<typeof TooltipContent>
} & React.PropsWithChildren

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	message,
	triggerProps = { type: 'button', asChild: false },
	providerProps = { delayDuration: 0 },
	contentProps = { side: 'top' }
}) => {
	return (
		<TooltipProvider {...providerProps}>
			<TooltipWrapper>
				<TooltipTrigger {...triggerProps}>{children}</TooltipTrigger>
				<TooltipContent {...contentProps} className={cn('z-50 whitespace-nowrap', contentProps.className)}>
					{message}
				</TooltipContent>
			</TooltipWrapper>
		</TooltipProvider>
	)
}
