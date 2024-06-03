import React from 'react';
import { Tooltip as TooltipWrapper, TooltipProvider, TooltipTrigger, TooltipContent } from '../@shadcn/tooltip';
import { cn } from '@/common/utils/cn';

type TooltipProps = {
	content: string;
	asChild?: boolean;
	tooltipProviderProps?: React.ComponentProps<typeof TooltipProvider>;
	tooltipContentProps?: React.ComponentProps<typeof TooltipContent>;
} & React.PropsWithChildren;

const Tooltip: React.FC<TooltipProps> = ({
	asChild = true,
	children,
	content,
	tooltipProviderProps = { delayDuration: 0 },
	tooltipContentProps = { side: 'top' }
}) => {
	return (
		<TooltipProvider {...tooltipProviderProps}>
			<TooltipWrapper>
				<TooltipTrigger asChild={asChild} type='button'>
					{children}
				</TooltipTrigger>
				<TooltipContent
					{...tooltipContentProps}
					className={cn('z-50 whitespace-nowrap', tooltipContentProps.className)}>
					{content}
				</TooltipContent>
			</TooltipWrapper>
		</TooltipProvider>
	);
};

export default Tooltip;
