import { cn } from '@/common/utils/cn'
import React, { useRef } from 'react'

export type DivProps = { as?: React.ElementType | keyof HTMLElementTagNameMap } & React.ComponentProps<
	'div' extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap : React.ElementType
>

export const Div: React.FC<DivProps> = (props) => {
	const { as: Component = 'div', className, style, children, ref, ...restProps } = props

	const localRef = useRef(null)
	const resolvedRef = ref || localRef

	return (
		<Component className={cn(className)} style={style} ref={resolvedRef} {...restProps}>
			{children}
		</Component>
	)
}
