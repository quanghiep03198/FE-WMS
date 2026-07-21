import { Div } from '@/components/ui'
import formatIntlNumber from '@common/utils/format-intl-number'
import React from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type SizeTableProps = {
	data: Array<{ size_numcode: string; qty: number }>
	total?: number
} & React.HTMLAttributes<HTMLDivElement>

const SizeTable: React.FC<SizeTableProps> = ({ data, total, ...props }) => {
	const { t } = useTranslation()

	if (!Array.isArray(data) || data.length === 0)
		return (
			<Div className='text-muted-foreground h-20 place-content-center text-center'>
				{t('ns_common:table.no_data')}
			</Div>
		)

	const sortedData = data.toSorted((a, b) => {
		if (!Number.isNaN(Number(a.size_numcode)) && !Number.isNaN(Number(b.size_numcode)))
			return Number(a.size_numcode) - Number(b.size_numcode)
		return a.size_numcode?.localeCompare(b.size_numcode)
	})

	return (
		<Table {...props}>
			<TableRow className='*:border-b'>
				<TableVerticalHeader>Size</TableVerticalHeader>
				{sortedData.map((item) => (
					<TableCellHead variant='small' key={item.size_numcode} className='bg-table-head'>
						{item.size_numcode}
					</TableCellHead>
				))}
				{total && (
					<TableCellHead className='bg-background text-foreground sticky right-0 font-medium'>
						{t('ns_common:common_fields.total')}
					</TableCellHead>
				)}
			</TableRow>
			<TableRow>
				<TableVerticalHeader>{t('ns_common:common_fields.quantity')}</TableVerticalHeader>
				{sortedData.map((item) => (
					<TableCell key={item.size_numcode}>{formatIntlNumber(item.qty)}</TableCell>
				))}
				{total && <TableCell className='sticky right-0 font-medium'>{formatIntlNumber(total)}</TableCell>}
			</TableRow>
		</Table>
	)
}

const Table = tw.div`relative **:last:top-0 **:first:basis-28 **:first:min-w-28 **:first:bg-background **:first:sticky **:first:left-0 *:text-sm w-full overflow-x-auto`
const TableRow = tw.div`flex *:px-4 *:not-last:border-l *:py-2 *:whitespace-nowrap *:last:shadow-[1px_0px_0px_var(--border)] *:first:border-l-0 *:last:border-r-0 *:last:border-l *:last:flex-1 *:basis-24 *:min-w-24`
const TableCell = tw.div`text-foreground text-left bg-background`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left bg-table-head`
const TableVerticalHeader = tw.div`sticky left-0 z-10 lowercase first-letter:uppercase border-l-0! shadow-[1px_0px_var(--border)] font-medium text-foreground`

export default SizeTable
