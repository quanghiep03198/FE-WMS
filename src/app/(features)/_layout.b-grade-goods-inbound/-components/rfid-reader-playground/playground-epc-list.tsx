import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useRef } from 'react'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5

export const PlaygroundEpcList: React.FC = () => {
	'use no memo'

	const { scannedEpcs } = useReaderPlaygroundStore('scannedEpcs')

	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const getScrollElement = useCallback(() => containerRef.current, [])

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpcs.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	return (
		<Div
			ref={containerRef}
			className={cn(
				'z-10 flex w-full flex-col items-stretch justify-start divide-y divide-border overflow-y-scroll bg-background p-2 will-change-transform contain-paint scrollbar-track-accent/50',
				'h-[calc(var(--outlet-wrapper-height)-var(--playground-header-height)-var(--playground-actions-height))]'
			)}>
			<Div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
				{virtualizer.getVirtualItems().map((virtualItem) => {
					const item = scannedEpcs[virtualItem.index]
					return (
						<Div
							key={virtualItem.index}
							data-index={virtualItem.index}
							className='absolute left-auto right-auto top-0 flex w-full justify-between whitespace-nowrap border-b px-4 py-2 font-medium uppercase transition-all duration-75 last:border-none hover:bg-secondary'
							style={{
								height: virtualItem.size,
								transform: `translateY(${virtualItem.start}px)`
							}}>
							{item}
						</Div>
					)
				})}
			</Div>
		</Div>
	)
}
