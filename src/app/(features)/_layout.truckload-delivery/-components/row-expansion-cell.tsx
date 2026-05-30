import { Icon } from '@/components/ui'
import type { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useQueryClient } from '@tanstack/react-query'
import type { CellContext } from '@tanstack/react-table'
import { useRef, useTransition } from 'react'
import { getTruckloadDeliveryDetailQueryOptions } from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'

type RowExpansionCellProps = CellContext<ITruckloadDelivery, any>

const RowExpansionCell: React.FC<RowExpansionCellProps> = ({ row, table }) => {
	const queryClient = useQueryClient()
	const intentRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [isTransitioning, startTransition] = useTransition()

	const startPrefetchIntent = () => {
		intentRef.current = setTimeout(() => {
			queryClient.prefetchQuery(getTruckloadDeliveryDetailQueryOptions(row.original.dispatch_order))
		}, 200)
	}

	const cancelPrefetchIntent = () => {
		if (intentRef.current) {
			clearTimeout(intentRef.current)
			intentRef.current = null
		}
	}

	return (
		<GhostButton
			className='absolute inset-0'
			disabled={isTransitioning}
			onPointerEnter={startPrefetchIntent}
			onPointerLeave={cancelPrefetchIntent}
			onClick={() =>
				startTransition(() => {
					row.toggleExpanded(!row.getIsExpanded())
					if (!row.getIsExpanded())
						table.setColumnFilters([{ id: 'dispatch_order', value: row.original.dispatch_order }])
					else table.resetColumnFilters()
				})
			}>
			<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
		</GhostButton>
	)
}

export default RowExpansionCell
