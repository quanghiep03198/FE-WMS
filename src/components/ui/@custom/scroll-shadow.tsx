import { cn } from '@/common/utils/cn'
import { useScroll, useSize, useUpdate } from 'ahooks'
import React, { forwardRef, memo, useEffect, useRef } from 'react'

export interface ScrollShadowProps extends React.PropsWithChildren, React.ComponentProps<'div'> {
	/**
	 * If size is a number, it will be treated as pixels, otherwise is a string, it will be treated as a CSS value such as px, rem or em.
	 */
	size?: React.CSSProperties['height']
	scrollbar?: boolean
	ref?: React.Ref<HTMLDivElement>
}

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(
	({ size = 320, scrollbar = false, className, children }, ref) => {
		const update = useUpdate()
		const localContainerRef = useRef<HTMLDivElement>(null)
		const resolvedRef = (ref ?? localContainerRef) as React.MutableRefObject<HTMLDivElement>

		const containerScroll = useScroll(resolvedRef)
		const clientSize = useSize(resolvedRef)

		const scrollHeight = resolvedRef.current?.scrollHeight ?? 0
		const scrollTop = resolvedRef.current?.scrollTop ?? 0
		const scrollClientHeight = resolvedRef.current?.clientHeight ?? 0

		const isScrolledToTop = containerScroll?.top === 0
		const isScrolledToBottom = scrollHeight - scrollTop - scrollClientHeight < 1
		const isScrollTopBottom = !isScrolledToTop && !isScrolledToBottom

		const isScrollable = scrollHeight > scrollClientHeight

		useEffect(update, [scrollHeight, scrollTop, scrollClientHeight, clientSize])

		return (
			<div
				ref={resolvedRef}
				style={{ '--scroll-shadow-size': typeof size === 'number' ? `${size}px` : size } as React.CSSProperties}
				data-top-scroll={isScrollable && isScrolledToTop}
				data-bottom-scroll={isScrollable && isScrolledToBottom}
				data-top-bottom-scroll={isScrollable && isScrollTopBottom}
				className={cn(
					className,
					scrollbar ? 'overflow-y-scroll scrollbar' : 'overflow-auto !scrollbar-none',
					'h-[var(--scroll-shadow-size)]',
					'data-[bottom-scroll=true]:[mask-image:linear-gradient(0deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/4),transparent)]',
					'data-[top-scroll=true]:[mask-image:linear-gradient(180deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/4),transparent)]',
					'data-[top-bottom-scroll=true]:[mask-image:linear-gradient(180deg,transparent,hsl(var(--sidebar-background))_calc(var(--scroll-shadow-size)/4),hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/4),transparent)]'
				)}>
				{children}
			</div>
		)
	}
)

export default memo(ScrollShadow)
