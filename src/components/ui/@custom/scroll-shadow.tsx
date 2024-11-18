import { cn } from '@/common/utils/cn'
import { useScroll } from 'ahooks'
import React, { forwardRef, useRef } from 'react'

export interface ScrollShadowProps extends React.PropsWithChildren, React.ComponentProps<'div'> {
	/**
	 * If size is a number, it will be treated as pixels, otherwise is a string, it will be treated as a CSS value such as px, rem or em.
	 */
	size?: React.CSSProperties['height']
	ref?: React.Ref<HTMLDivElement>
}

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(({ size = 320, className, children }, ref) => {
	const localContainerRef = useRef<HTMLDivElement>(null)
	const resolvedRef = (ref ?? localContainerRef) as React.MutableRefObject<HTMLDivElement>

	const containerScroll = useScroll(resolvedRef)
	const isScrolledToTop = containerScroll?.top === 0
	const isScrolledToBottom =
		resolvedRef.current?.scrollHeight - resolvedRef.current?.scrollTop - resolvedRef.current?.clientHeight < 1
	const isScrollTopBottom = !isScrolledToTop && !isScrolledToBottom

	return (
		<div
			ref={resolvedRef}
			style={{ '--scroll-shadow-size': typeof size === 'number' ? `${size}px` : size } as React.CSSProperties}
			data-top-scroll={isScrolledToTop}
			data-bottom-scroll={isScrolledToBottom}
			data-top-bottom-scroll={isScrollTopBottom}
			className={cn(
				className,
				'h-[var(--scroll-shadow-size)] overflow-y-auto transition-colors duration-200 !scrollbar-none',
				'data-[bottom-scroll=true]:[mask-image:linear-gradient(0deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/2),transparent)]',
				'data-[top-scroll=true]:[mask-image:linear-gradient(180deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/2),transparent)]',
				'data-[top-bottom-scroll=true]:[mask-image:linear-gradient(180deg,transparent,hsl(var(--sidebar-background))_calc(var(--scroll-shadow-size)/4),hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/4),transparent)]'
			)}>
			{children}
		</div>
	)
})

export default ScrollShadow
