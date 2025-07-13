import { notUndefined, Virtualizer } from '@tanstack/react-virtual'
import { useMemo } from 'react'

export default function useVirutalScrollOffset(virtualizer: Virtualizer<any, any>) {
	const virtualItems = virtualizer.getVirtualItems()

	return useMemo(
		() =>
			virtualItems?.length > 0
				? {
						before: notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
						after:
							virtualItems?.length > 0
								? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems?.length - 1]).end
								: 0
					}
				: { before: 0, after: 0 },
		[virtualItems]
	)
}
