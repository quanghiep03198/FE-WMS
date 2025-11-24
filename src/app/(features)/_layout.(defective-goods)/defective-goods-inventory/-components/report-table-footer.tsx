'use no memo'

import formatIntlNumber from '@/common/utils/format-intl-number'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../-constants'

type ReportTableSummaryProps = { summaryData: Record<DefectiveCategory, number> }

const ReportTableSummary: React.FC<ReportTableSummaryProps> = ({ summaryData }) => {
	const { t } = useTranslation()

	return (
		<Table className='table-fixed'>
			<TableHeader>
				<TableRow className='[&_th]:bg-table-head [&_th]:text-table-head-foreground'>
					<TableHead align='right'>{t('ns_inoutbound:shoes_category.b_grade')}</TableHead>
					<TableHead align='right'>{t('ns_inoutbound:shoes_category.c_grade')}</TableHead>
					<TableHead align='right'>{t('ns_inoutbound:shoes_category.research_development')}</TableHead>
					<TableHead align='right'>{t('ns_common:common_fields.total')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell align='right'>{formatIntlNumber(summaryData?.B ?? 0)} (prs)</TableCell>
					<TableCell align='right'>{formatIntlNumber(summaryData?.C ?? 0)} (pcs)</TableCell>
					<TableCell align='right'>{formatIntlNumber(summaryData?.RD ?? 0)} (prs)</TableCell>
					<TableCell align='right'>
						{Object.values(summaryData).reduce((acc, curr) => {
							if (typeof curr === 'number') return acc + curr
							return acc
						}, 0)}{' '}
						(prs/pcs)
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

export default ReportTableSummary
