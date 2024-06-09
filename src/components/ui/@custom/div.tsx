import { cn } from '@/common/utils/cn'
import React, { forwardRef, useRef } from 'react'

export type TDivProps = { as?: React.ElementType | keyof HTMLElementTagNameMap } & React.ComponentProps<
	'div' extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap : React.ElementType
>

export const Div: React.ForwardRefExoticComponent<TDivProps> = forwardRef((props, ref) => {
	const { as: Component = 'div', className, style, children, ...restProps } = props

	const localRef = useRef(null)
	const resolvedRef = ref || localRef

	return (
		<Component className={cn(className)} style={style} ref={resolvedRef} {...restProps}>
			{children}
		</Component>
	)
})
