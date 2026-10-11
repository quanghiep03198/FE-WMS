import { Div } from '@components/customs/div'
import { Icon } from '@components/ui/icon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import type { IOutboundReport } from '@features/report/types'
import { useTranslation } from 'react-i18next'
import ReportDetailFooter from './report-detail-footer'
import { ReportDetailRow } from './report-detail-row'

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
							className='left-0 z-20 whitespace-nowrap shadow-[1px_0px_0px_var(--border)] xl:sticky'
							style={{ width: 'var(--sticky-left-col-width)', minWidth: 'var(--sticky-left-col-width)' }}>
							{t('ns_erp:fields.mo_no')}
						</TableHead>
						<TableHead align='center'>Size</TableHead>
						<TableHead align='right' className='bg-background right-0 z-20 w-28 min-w-28 xl:sticky'>
							{t('ns_common:common_fields.total')}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(detail) && detail.length > 0 ? (
						detail.map((item) => <ReportDetailRow data={item} key={item.mo_no} />)
					) : (
						<TableRow>
							<TableCell align='center' className='text-muted-foreground border-b! p-20' colSpan={4}>
								<Div className='inline-flex items-center justify-center gap-x-2'>
									<Icon name='Inbox' size={24} strokeWidth={1} />
									{t('ns_common:table.no_data')}
								</Div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				{overall.length > 0 && <ReportDetailFooter data={overall} />}
			</Table>
		</Div>
	)
}

OutboundReportDetailTable.displayName = 'OutboundReportDetailTable'

export default OutboundReportDetailTable
