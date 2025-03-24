import { IOutboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const OutboundReportDetailTable: React.FC<{ data: IOutboundReport['size_data'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<Div className='w-1/4 overflow-clip rounded-md border'>
			<Table className='table-fixed !border-none'>
				<TableHeader>
					<TableRow>
						<TableHead>Size</TableHead>
						<TableHead>{t('ns_erp:fields.inbound_qty')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(data) && data.length > 0 ? (
						data.map((item) => (
							<TableRow key={item.size_numcode}>
								<TableCell align='center' className='font-medium'>
									{item.size_numcode}
								</TableCell>
								<TableCell align='center'>{formatIntlNumber(item.qty)}</TableCell>
								{data.length === 0 && <TableCell></TableCell>}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell align='center' colSpan={2} className='font-medium'>
								{t('ns_common:table.no_data')}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Div>
	)
}

OutboundReportDetailTable.displayName = 'OutboundReportDetailTable'

export default OutboundReportDetailTable
