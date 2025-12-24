import { IMonthlyInventoryAudit } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { useTranslation } from 'react-i18next'

const DataTableSummary: React.FC<{ data: IMonthlyInventoryAudit[]; isLoading: boolean }> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const totalInitialQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.init_inv_qty, 0) : 0
	const totalInboundQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.total_instock_qty, 0) : 0
	const totalOutboundQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.total_outstock_qty, 0) : 0
	const actualInventoryQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.actual_inv_qty, 0) : 0
	const finalInventoryQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.final_inv_qty, 0) : 0
	const totalNumberOfStorageLocation = Array.isArray(data)
		? Math.max(...data.map((item) => item.total_number_of_storage))
		: 0
	const totalStorageCapacity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.storage_capacity, 0) : 0

	return (
		<Table className='w-full table-fixed'>
			<TableHeader>
				<TableRow className='[&_th>span]:line-clamp-1 [&_th]:bg-table-head [&_th]:capitalize [&_th]:text-table-head-foreground'>
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
						{isLoading ? <Skeleton /> : formatIntlNumber(totalNumberOfStorageLocation)}
					</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalStorageCapacity)}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

export default DataTableSummary
