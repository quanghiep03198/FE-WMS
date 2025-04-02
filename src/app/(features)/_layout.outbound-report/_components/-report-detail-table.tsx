import { IOutboundReport } from '@/common/types/entities'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { ReportDetailRow } from './-report-detail-row'

const OutboundReportDetailTable: React.FC<{ data: IOutboundReport['detail'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<Div className='relative flex flex-col divide-y overflow-hidden rounded-lg border'>
			<Div className='max-h-[40vh] overflow-scroll'>
				<Table
					className='border-separate border-spacing-0 rounded-lg'
					style={
						{
							'--row-selection-col-width': '3rem',
							'--sticky-left-col-width': '10rem',
							'--row-action-col-width': '5rem'
						} as React.CSSProperties
					}>
					<TableHeader className='sticky top-0 z-20'>
						<TableRow className='sticky'>
							<TableHead className='left-0 z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
								{t('ns_erp:fields.mo_no')}
							</TableHead>
							<TableHead>Size</TableHead>
							<TableHead className='right-0 z-20 w-32 bg-background xl:sticky'>
								{t('ns_common:common_fields.total')}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.isArray(data) && data.length > 0 ? (
							data.map((item) => <ReportDetailRow key={item.mo_no} data={item} />)
						) : (
							<TableRow>
								<TableCell align='center' colSpan={4} className='p-20 text-muted-foreground'>
									<Div className='inline-flex items-center justify-center gap-x-2'>
										<Icon name='Inbox' size={24} strokeWidth={1} />
										{t('ns_common:table.no_data')}
									</Div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Div>
		</Div>
	)
}

OutboundReportDetailTable.displayName = 'OutboundReportDetailTable'

export default OutboundReportDetailTable
