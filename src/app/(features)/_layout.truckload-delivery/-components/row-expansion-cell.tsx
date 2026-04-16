import { Icon } from '@/components/ui'
import type { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useQueryClient } from '@tanstack/react-query'
import type { CellContext } from '@tanstack/react-table'
import { getTruckloadDeliveryDetailQueryOptions } from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'

type RowExpansionCellProps = CellContext<ITruckloadDelivery, any> & {
	onExpansionChange: (value: { [key: string]: boolean }) => void
	onResetTableData: () => void
	onTableDataChange: React.Dispatch<React.SetStateAction<ITruckloadDelivery[]>>
}

const RowExpansionCell: React.FC<RowExpansionCellProps> = ({
	row,
	onExpansionChange,
	onResetTableData,
	onTableDataChange
}) => {
	const queryClient = useQueryClient()
	return (
		<GhostButton
			className='absolute inset-0'
			disabled={false}
			onPointerEnter={() =>
				queryClient.prefetchQuery(getTruckloadDeliveryDetailQueryOptions(row.original.dispatch_order))
			}
			onClick={() => {
				onExpansionChange({ [row.original.dispatch_order]: !row.getIsExpanded() })
				if (row.getIsExpanded()) onResetTableData()
				else onTableDataChange((prev) => prev.filter((item) => item.dispatch_order === row.original.dispatch_order))
			}}>
			<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
		</GhostButton>
	)
}

export default RowExpansionCell
