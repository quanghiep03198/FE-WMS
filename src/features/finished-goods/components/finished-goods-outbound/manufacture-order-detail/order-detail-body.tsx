import type { OrderItem } from '@/features/finished-goods/types'
import { TableBody, TableCell, TableRow } from '@components/ui'
import type { Virtualizer } from '@tanstack/react-virtual'
import { notUndefined } from '@tanstack/react-virtual'
import TableDataRow from './order-detail-row'

type OrderDetailTableBodyProps = {
	virtualizer: Virtualizer<any, any>
	data: OrderItem[]
}

const OrderDetailTableBody: React.FC<OrderDetailTableBodyProps> = ({ virtualizer, data }) => {
	'use no memo'

	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualItems.length > 0
						? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems.length - 1]).end
						: 0
				]
			: [0, 0]

	return (
		<TableBody>
			{before > 0 && (
				<TableRow>
					<TableCell colSpan={6} style={{ height: before }} />
				</TableRow>
			)}
			{Array.isArray(virtualItems) &&
				virtualItems.map((virtualRow) => {
					const row = data[virtualRow.index]
					return <TableDataRow key={row.mo_no} data={row} virtualRow={virtualRow} />
				})}
			{after > 0 && (
				<TableRow ref={(node) => virtualizer.measureElement(node)}>
					<TableCell colSpan={6} style={{ height: after }} />
				</TableRow>
			)}
		</TableBody>
	)
}

export default OrderDetailTableBody
