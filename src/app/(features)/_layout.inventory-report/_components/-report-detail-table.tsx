import { IMonthlyInventoryReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div } from '@/components/ui'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

export const InventoryReportDetailTable: React.FC<{ data: IMonthlyInventoryReport['size_data'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<ScrollArea>
			<Table>
				{Array.isArray(data) && data.length > 0 ? (
					<Fragment>
						<TableRow>
							<TableVerticalHeader align='left'>Size</TableVerticalHeader>
							{data.map((item) => (
								<TableCellHead key={item.size} align='center'>
									{item.size}
								</TableCellHead>
							))}
						</TableRow>

						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.total_init_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.int_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.mo_size_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ms_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.inbound_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ist_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.actual_instock_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.mn_ist_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.outbound_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ost_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.actual_outstock_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.mn_ost_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.final_inventory_qty')}</TableVerticalHeader>
							{data.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.fnl_qty)}
								</TableCell>
							))}
						</TableRow>
					</Fragment>
				) : (
					<Div align='center' className='p-10 font-medium'>
						{t('ns_common:table.no_data')}
					</Div>
				)}
			</Table>
		</ScrollArea>
	)
}

const ScrollArea = tw.div`relative h-fit max-w-full overflow-auto overflow-x-scroll rounded-md border bg-background`
const Table = tw.div`[&>*>:first-child]:top-0 [&>*>:first-child]:font-medium [&>*>:first-child]:text-table-head-foreground`
const TableVerticalHeader = tw.div`sticky left-0 z-10`
const TableRow = tw.div`flex [&>*]:px-4 [&>*]:border-b [&>*]:bg-background [&>*]:py-2 [&>*]:whitespace-nowrap [&>*]:border-r [&>:last-child]:border-r-0 [&>:first-child]:basis-52 [&>:first-child]:min-w-52 [&>:not(:first-child)]:basis-24 [&>:not(:first-child)]:min-w-24`
const TableCell = tw.div`text-foreground`
const TableCellHead = tw.div`text-table-head-foreground font-medium`

InventoryReportDetailTable.displayName = 'InboundReportDetailTable'
