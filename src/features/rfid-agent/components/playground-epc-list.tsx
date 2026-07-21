import { Div } from '@/components/ui'
import { CommonActions } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import useScrollToFn from '@hooks/use-scroll-fn'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useVirtualizer } from '@tanstack/react-virtual'
import { omit } from 'lodash-es'
import { memo, useCallback, useEffect, useRef } from 'react'
import { usePageContext } from '../../defective-goods/contexts/page-context'
import { useReaderPlaygroundStore } from '../contexts/rfid-reader-playground.context'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5

export const PlaygroundEpcList: React.FC = () => {
	const { event$ } = usePageContext()
	const { scannedEpcs, resetScannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'resetScannedEpcs')

	const containerRef = useRef<HTMLDivElement>(null)

	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const getScrollElement = useCallback(() => containerRef.current, [])

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpcs.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		getItemKey: (index) => scannedEpcs[index],
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	useEffect(() => {
		event$.emit({ action: CommonActions.IMPORT, payload: scannedEpcs })
	}, [scannedEpcs])

	event$.useSubscription((e: { action: CommonActions; payload: [] }) => {
		if (e.action === CommonActions.SAVE) resetScannedEpcs()
	})

	return (
		<Div
			ref={containerRef}
			className={cn(
				'divide-border bg-background scrollbar-track-accent/50 z-10 flex w-full flex-col items-stretch justify-start divide-y overflow-y-scroll p-2 will-change-transform contain-paint',
				'h-full'
			)}>
			<Div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
				{virtualizer.getVirtualItems().map((virtualItem) => {
					const item = scannedEpcs[virtualItem.index]
					return <ReaderVirtualRow key={virtualItem.key} data={item} {...omit(virtualItem, ['key'])} />
				})}
			</Div>
		</Div>
	)
}

const ReaderVirtualRow: React.FC<{ data: string } & VirtualItem> = memo(({ data, index, size, start }) => {
	return (
		<Div
			key={index}
			data-index={index}
			className='hover:bg-accent absolute top-0 right-auto left-auto w-full border-b px-4 py-2 font-medium whitespace-nowrap uppercase last:border-none'
			style={{
				height: size,
				transform: `translateY(${start}px)`
			}}>
			{data}
		</Div>
	)
})

ReaderVirtualRow.displayName = 'ReaderVirtualRow'
