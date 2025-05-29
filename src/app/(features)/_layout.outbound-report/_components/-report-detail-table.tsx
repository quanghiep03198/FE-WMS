import { IOutboundReport } from '@/common/types/entities'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import ReportDetailFooter from './-report-detail-footer'
import { ReportDetailRow } from './-report-detail-row'

const OutboundReportDetailTable: React.FC<Pick<IOutboundReport, 'detail' | 'overall'>> = ({ detail, overall }) => {
	const { t } = useTranslation()

	return (
		<Div className='overflow-auto rounded-md border'>
			<Table
				className='border-separate border-spacing-0 rounded-lg'
				style={{ '--sticky-left-col-width': '12rem' } as React.CSSProperties}>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow className='sticky'>
						<TableHead
							align='left'
							className='left-0 z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap shadow-[1px_0px_0px_hsl(var(--border))] xl:sticky'>
							{t('ns_erp:fields.mo_no')}
						</TableHead>
						<TableHead align='center'>Size</TableHead>
						<TableHead align='right' className='right-0 z-20 w-28 min-w-28 bg-background xl:sticky'>
							{t('ns_common:common_fields.total')}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(detail) && detail.length > 0 ? (
						detail.map((item) => <ReportDetailRow key={item.mo_no} data={item} />)
					) : (
						<TableRow>
							<TableCell align='center' colSpan={4} className='!border-b p-20 text-muted-foreground'>
								<Div className='inline-flex items-center justify-center gap-x-2'>
									<Icon name='Inbox' size={24} strokeWidth={1} />
									{t('ns_common:table.no_data')}
								</Div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<ReportDetailFooter data={overall} />
			</Table>
		</Div>
	)
}

OutboundReportDetailTable.displayName = 'OutboundReportDetailTable'

export default OutboundReportDetailTable
