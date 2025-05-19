import { cn } from '@/common/utils/cn'
import { useRafState, useScroll } from 'ahooks'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

export interface ScrollShadowProps extends React.PropsWithChildren, React.ComponentProps<'div'> {
	orientation?: 'vertical' | 'horizontal'
	ref?: React.RefObject<HTMLDivElement>
}

const ScrollShadow: React.FC<ScrollShadowProps> = ({ className, orientation = 'vertical', children, ref }) => {
	const localRef = useRef<HTMLDivElement>(null)
	const resolvedRef = (ref ?? localRef) as React.RefObject<HTMLDivElement>

	const [isScrollable, setIsScrollable] = useRafState<boolean>(true)
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
			className={cn(className, orientation === 'vertical' ? 'overflow-y-auto' : 'overflow-x-auto')}>
			<div
				className={cn(
					orientation === 'vertical' &&
						`data-[bottom-scroll=true]:[mask-image:linear-gradient(0deg,hsl(var(--background))_55%,transparent_85%)] data-[top-scroll=true]:[mask-image:linear-gradient(180deg,hsl(var(--background))_50%,transparent_85%)] data-[away-edge=true]:[mask-image:linear-gradient(180deg,transparent_0%,hsl(var(--background))_30%_60%,transparent_100%)]`,
					orientation === 'horizontal' &&
						`data-[right-scroll=true]:[mask-image:linear-gradient(270deg,hsl(var(--sidebar-background))_85%,transparent)] data-[left-scroll=true]:[mask-image:linear-gradient(90deg,hsl(var(--background))_85%,transparent)] data-[away-edge=true]:[mask-image:linear-gradient(90deg,transparent_0%,hsl(var(--background))_25%_65%,transparent_100%)]`
				)}
				data-top-scroll={isScrollable && scrollStates.isScrolledToTop}
				data-bottom-scroll={isScrollable && scrollStates.isScrolledToBottom}
				data-away-edge={isScrollable && scrollStates.isAwayFromEdge}
				data-left-scroll={isScrollable && scrollStates.isScrollToStart}
				data-right-scroll={isScrollable && scrollStates.isScrollToEnd}>
				{children}
			</div>
		</div>
	)
}

ScrollShadow.displayName = 'ScrollShadow'

export default ScrollShadow
