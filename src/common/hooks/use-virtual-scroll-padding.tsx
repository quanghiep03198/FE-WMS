import { notUndefined, Virtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export default function useVirtualScrollPadding<
	ContainerElement extends HTMLElement,
	VirtualItemElement extends HTMLElement
>(virtualizer: Virtualizer<ContainerElement, VirtualItemElement>) {
	const virtualItems = virtualizer.getVirtualItems()

	const offsetRef = useRef<Record<'before' | 'after', number>>({ before: 0, after: 0 })

	if (virtualItems?.length > 0)
		offsetRef.current = {
			before: notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
			after:
				virtualItems?.length > 0
					? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems?.length - 1]).end
					: 0
		}

	return offsetRef.current
}
