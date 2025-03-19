import { IMonthlyInventoryReport } from '@/common/types/entities'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export const InventorySizeTable: React.FC<{ data: IMonthlyInventoryReport['size_data'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<ScrollShadow orientation='horizontal' className='max-w-full overflow-auto rounded-md border bg-background'>
			<Table className='w-auto table-fixed !border-none'>
				{Array.isArray(data) && data.length > 0 ? (
					<Fragment>
						<TableHeader>
							<TableRow>
								<TableHead align='left' className='w-48'>
									Size
								</TableHead>
								{data.map((item) => (
									<TableHead key={item.size_numcode} align='center' className='w-24'>
										{item.size_numcode}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody className='[&>tr>:first-child]:font-medium [&>tr>:first-child]:text-table-head-foreground'>
							<TableRow>
								<TableCell align='left'>{t('ns_erp:fields.total_init_qty')}</TableCell>
								{data.map((item) => (
									<TableCell key={item.size_numcode} align='center'>
										{item.init_inv_qty}
									</TableCell>
								))}
							</TableRow>
							<TableRow>
								<TableCell align='left'>{t('ns_erp:fields.inbound_qty')}</TableCell>
								{data.map((item) => (
									<TableCell key={item.size_numcode} align='center'>
										{item.instock_qty}
									</TableCell>
								))}
							</TableRow>
							<TableRow>
								<TableCell align='left'>{t('ns_erp:fields.outbound_qty')}</TableCell>
								{data.map((item) => (
									<TableCell key={item.size_numcode} align='center'>
										{item.outstock_qty}
									</TableCell>
								))}
							</TableRow>
							<TableRow>
								<TableCell align='left'>{t('ns_erp:fields.final_inventory_qty')}</TableCell>
								{data.map((item) => (
									<TableCell key={item.size_numcode} align='center'>
										{item.final_inv_qty}
									</TableCell>
								))}
							</TableRow>
						</TableBody>
					</Fragment>
				) : (
					<TableBody>
						<TableRow>
							<TableCell align='center' colSpan={2} className='font-medium'>
								{t('ns_common:table.no_data')}
							</TableCell>
						</TableRow>
					</TableBody>
				)}
			</Table>
		</ScrollShadow>
	)
}

InventorySizeTable.displayName = 'InboundReportDetailTable'
