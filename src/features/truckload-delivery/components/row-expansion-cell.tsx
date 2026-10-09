import type { CellContext } from '@tanstack/react-table'
import type { ITruckloadDelivery } from '../types'
import TruckloadDeliveryDetailDialog from './truckload-delivery-detail-dialog'

type RowExpansionCellProps = CellContext<ITruckloadDelivery, any>

const RowExpansionCell: React.FC<RowExpansionCellProps> = ({ row }) => {
	return <TruckloadDeliveryDetailDialog data={row.original} />
}

export default RowExpansionCell
