import formatIntlNumber from '@/common/utils/format-intl-number'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { useTranslation } from 'react-i18next'

export default function DataTableSummary({
	isLoading,
	accumulatedQuantity,
	missingQuantity
}: {
	isLoading: boolean
	accumulatedQuantity: number
	missingQuantity: number
}) {
	const { t } = useTranslation()

	return (
		<Table className='w-full table-fixed'>
			<TableHeader className='[&_th]:bg-table-head [&_th]:text-table-head-foreground'>
				<TableRow>
					<TableHead colSpan={2} className='!text-foreground'>
						{t('ns_common:titles.overall')}
					</TableHead>
				</TableRow>
				<TableRow>
					<TableHead align='right'>{t('ns_erp:fields.accumulated_qty')}</TableHead>
					<TableHead align='right'>{t('ns_erp:fields.missing_qty')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className='divide-x *:font-medium'>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(accumulatedQuantity)}</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(missingQuantity)}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}
