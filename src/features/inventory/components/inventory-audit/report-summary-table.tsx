import formatIntlNumber from '@common/utils/format-intl-number'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui'
import Skeleton from '@components/ui/@custom/skeleton'
import type { IMonthlyInventoryAudit } from '@features/inventory/types'
import { useGetWarehouseStorageSummaryQuery } from '@features/warehouse/hooks/use-warehouse-storage-request'
import { useTranslation } from 'react-i18next'

const DataTableSummary: React.FC<{ data: IMonthlyInventoryAudit[]; isLoading: boolean }> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const { data: storageSummary, isLoading: isLoadingStorageSummary } = useGetWarehouseStorageSummaryQuery()

	const totalInitialQuantity = Array.isArray(data)
		? data.reduce((acc, curr) => acc + curr.beginning_inventory_qty, 0)
		: 0
	const totalInboundQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.total_stocked_in_qty, 0) : 0
	const totalOutboundQuantity = Array.isArray(data)
		? data.reduce((acc, curr) => acc + curr.total_shipped_out_qty, 0)
		: 0
	const actualInventoryQuantity = Array.isArray(data)
		? data.reduce((acc, curr) => acc + curr.total_supplemental_qty, 0)
		: 0
	const finalInventoryQuantity = Array.isArray(data)
		? data.reduce((acc, curr) => acc + curr.final_inventory_qty, 0)
		: 0

	return (
		<Table className='w-full table-fixed'>
			<TableHeader>
				<TableRow className='[&_th]:bg-table-head [&_th]:text-table-head-foreground [&_th]:capitalize [&_th>span]:line-clamp-1'>
					<TableHead align='right'>
						<span>{t('ns_erp:fields.total_init_qty')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_erp:fields.inbound_qty')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_erp:fields.outbound_qty')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_erp:fields.actual_inventory_qty')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_erp:fields.final_inventory_qty')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_warehouse:fields.total_number_of_storage')}</span>
					</TableHead>
					<TableHead align='right'>
						<span>{t('ns_warehouse:fields.total_storage_capacity')}</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className='divide-x *:font-medium'>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalInitialQuantity)}</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalInboundQuantity)}</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalOutboundQuantity)}</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(actualInventoryQuantity)}
					</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(finalInventoryQuantity)}
					</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(storageSummary?.total_number_of_storage ?? 0)}
					</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(storageSummary?.total_storage_capacity ?? 0)}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

export default DataTableSummary
