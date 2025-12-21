import useMeasureElement from '@/common/hooks/use-measure-element'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Table } from '@/components/ui'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useResetState } from 'ahooks'
import { sortBy } from 'lodash-es'
import { useMemo, useRef } from 'react'
import { usePageContext } from '../../-contexts/page-context'
import { OrderItem } from '../../..'
import TableBody from './order-detail-body'
import TableEmptyState from './order-detail-empty-state'
import TableFooter from './order-detail-footer'
import TableHeader from './order-detail-header'

const VIRTUAL_ROW_HEIGHT = 75 // Default row height for virtualized table

const OrderSizeDetailTable: React.FC = () => {
	const { scannedOrders } = usePageContext('scannedOrders')
	const [columnFilters, setColumnFilters] = useResetState<Omit<OrderItem, 'sizes' | 'factory_code_produce'>>({
		mo_no: '',
		color_sn: '',
		factory_shoes_style: ''
	})

	const filteredScannedOrders = useMemo(() => {
		const { mo_no, color_sn, factory_shoes_style } = columnFilters
		const result = Array.isArray(scannedOrders)
			? scannedOrders.filter((item) => {
					if (item)
						return (
							item.mo_no.toLowerCase().includes(mo_no?.trim()?.toLowerCase()) &&
							item.color_sn.toLowerCase().includes(color_sn?.trim()?.toLowerCase()) &&
							item.factory_shoes_style.toLowerCase().includes(factory_shoes_style?.trim()?.toLowerCase())
						)
				})
			: []

		return sortBy(result, ['mo_no'])
	}, [scannedOrders, columnFilters])

	const totalFilteredQty = useMemo(
		() =>
			Array.isArray(filteredScannedOrders) && filteredScannedOrders.every((item) => Array.isArray(item.sizes))
				? formatIntlNumber(
						filteredScannedOrders?.reduce(
							(acc, curr) => acc + curr.sizes.reduce((_acc, _curr) => _acc + _curr.count, 0),
							0
						)
					)
				: 0,
		[filteredScannedOrders]
	)

	const containerRef = useRef<HTMLDivElement>(null)

	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ROW_HEIGHT)
	const measureElement = useMeasureElement()

	const virtualizer = useVirtualizer({
		count: filteredScannedOrders.length,
		overscan: 0,
		getScrollElement: () => containerRef.current,
		useAnimationFrameWithResizeObserver: false,
		estimateSize,
		measureElement,
		scrollToFn
	})

	const handleColumnFilterChange = useMemoizedFn(setColumnFilters)

	return (
		<Div
			className='relative z-20 flex h-[var(--outlet-wrapper-height)] max-w-full flex-1 flex-col justify-between gap-0 divide-y overflow-hidden rounded-lg border xxl:sticky xxl:top-[var(--header-height)]'
			style={
				{
					'--table-footer-height': '2rem'
				} as React.CSSProperties
			}>
			<Div
				ref={containerRef}
				className='h-[calc(var(--outlet-wrapper-height)-1.25*var(--table-footer-height))] w-full max-w-full overflow-scroll rounded-lg scrollbar-track-accent/20'>
				<Table
					className='w-full border-separate border-spacing-0 rounded-lg'
					style={
						{
							'--sticky-left-col-width': '9rem',
							'--row-action-col-width': '4rem'
						} as React.CSSProperties
					}>
					<TableHeader onColumnFilterChange={handleColumnFilterChange} />
					{!Array.isArray(filteredScannedOrders) || filteredScannedOrders.length === 0 ? (
						<TableEmptyState />
					) : (
						<TableBody virtualizer={virtualizer} data={filteredScannedOrders} />
					)}
				</Table>
			</Div>
			<TableFooter totalFilteredQty={String(totalFilteredQty)} />
		</Div>
	)
}

export default OrderSizeDetailTable
