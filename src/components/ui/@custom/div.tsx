import { cn } from '@/common/utils/cn';
import React, { forwardRef, useRef } from 'react';

type TBoxProps = { as?: React.ElementType } & React.PropsWithChildren & React.ComponentProps<React.ElementType>;

export const Div: React.ForwardRefExoticComponent<TBoxProps> = forwardRef((props, ref) => {
	const { as: Component = 'div', className, style, children, ...restProps } = props;

	const localRef = useRef(null);
	const resolvedRef = ref || localRef;

	return (
		<Component className={cn(className)} style={style} ref={resolvedRef} {...restProps}>
			{children}
		</Component>
	);
});
