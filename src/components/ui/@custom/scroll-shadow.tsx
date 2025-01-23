import { cn } from '@/common/utils/cn'
import { useScroll } from 'ahooks'
import { debounce } from 'lodash'
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface ScrollShadowProps extends React.PropsWithChildren, React.ComponentProps<'div'> {
	orientation?: 'vertical' | 'horizontal'
	ref?: React.Ref<HTMLDivElement>
}

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(
	({ className, orientation = 'vertical', children }, ref) => {
		const localRef = useRef<HTMLDivElement>(null)
		const resolvedRef = (ref ?? localRef) as React.MutableRefObject<HTMLDivElement>

		const [isScrollable, setIsScrollable] = useState<boolean>(true)
		const containerScroll = useScroll(resolvedRef)

		const scrollStates = useMemo(() => {
			const scrollHeight = resolvedRef.current?.scrollHeight ?? 0
			const scrollWidth = resolvedRef.current?.scrollWidth ?? 0
			const scrollTop = containerScroll?.top ?? 0
			const scrollLeft = containerScroll?.left ?? 0
			const scrollClientHeight = resolvedRef.current?.clientHeight ?? 0
			const scrollClientWidth = resolvedRef.current?.clientWidth ?? 0

			const isScrolledToTop = scrollTop === 0
			const isScrolledToBottom = scrollHeight - scrollTop - scrollClientHeight < 1
			const isScrollToStart = scrollLeft === 0
			const isScrollToEnd = scrollWidth - scrollLeft - scrollClientWidth < 1
			const isAwayFromEdge = (!isScrolledToTop && !isScrolledToBottom) || (!isScrollToStart && !isScrollToEnd)

			return {
				isScrolledToTop,
				isScrolledToBottom,
				isScrollToStart,
				isScrollToEnd,
				isAwayFromEdge
			}
		}, [containerScroll, resolvedRef])

		const handleScheckScrollable = useCallback(
			debounce(() => {
				const element: HTMLDivElement = resolvedRef.current
				if (element) {
					const _isScrollable =
						orientation === 'vertical'
							? element.scrollHeight > element.clientHeight
							: element.scrollWidth > element.clientWidth
					setIsScrollable(_isScrollable)
				}
			}, 100),
			[]
		)

		useEffect(() => {
			const element = resolvedRef.current

			handleScheckScrollable()

			const mutationObserver = new MutationObserver(handleScheckScrollable)
			const resizeObserver = new ResizeObserver(handleScheckScrollable)

			if (element) {
				mutationObserver.observe(element, { childList: true, subtree: true })
				resizeObserver.observe(element)
			}

			return () => {
				mutationObserver.disconnect()
				resizeObserver.disconnect()
			}
		}, [])

		return (
			<div
				ref={resolvedRef}
				data-top-scroll={isScrollable && scrollStates.isScrolledToTop}
				data-bottom-scroll={isScrollable && scrollStates.isScrolledToBottom}
				data-away-edge={isScrollable && scrollStates.isAwayFromEdge}
				data-left-scroll={isScrollable && scrollStates.isScrollToStart}
				data-right-scroll={isScrollable && scrollStates.isScrollToEnd}
				className={cn(
					className,
					orientation === 'vertical' &&
						`overflow-y-auto data-[bottom-scroll=true]:[mask-image:linear-gradient(0deg,hsl(var(--sidebar-background))_85%,transparent)] data-[top-scroll=true]:[mask-image:linear-gradient(180deg,hsl(var(--sidebar-background))_85%,transparent)] data-[away-edge=true]:[mask-image:linear-gradient(to_bottom,transparent_5%,hsl(var(--sidebar-background))_15%_85%,transparent)]`,
					orientation === 'horizontal' &&
						`overflow-x-auto data-[right-scroll=true]:[mask-image:linear-gradient(270deg,hsl(var(--sidebar-background))_85%,transparent)] data-[left-scroll=true]:[mask-image:linear-gradient(90deg,hsl(var(--sidebar-background))_85%,transparent)] data-[away-edge=true]:[mask-image:linear-gradient(to_right,transparent_5%,hsl(var(--sidebar-background))_15%_85%,transparent)]`
				)}>
				{children}
			</div>
		)
	}
)

ScrollShadow.displayName = 'ScrollShadow'

export default ScrollShadow
