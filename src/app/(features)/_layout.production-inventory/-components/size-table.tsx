import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div } from '@/components/ui'
import { sortBy } from 'lodash'
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
			<Div className='h-20 place-content-center text-center text-muted-foreground'>
				{t('ns_common:table.no_data')}
			</Div>
		)

	const sortedData = sortBy(data, (item) => item.size_numcode)

	return (
		<Table {...props}>
			<TableRow className='[&>*]:border-b'>
				<TableVerticalHeader className='text-foreground'>Size</TableVerticalHeader>
				{sortedData.map((item) => (
					<TableCellHead variant='small' key={item.size_numcode} className='bg-table-head'>
						{item.size_numcode}
					</TableCellHead>
				))}
				{total && (
					<TableCellHead className='sticky right-0 bg-background font-medium text-foreground'>
						{t('ns_common:common_fields.total')}
					</TableCellHead>
				)}
			</TableRow>
			<TableRow>
				<TableVerticalHeader className='text-foreground'>
					{t('ns_common:common_fields.quantity')}
				</TableVerticalHeader>
				{sortedData.map((item) => (
					<TableCell key={item.size_numcode}>{formatIntlNumber(item.qty)}</TableCell>
				))}
				{total && <TableCell className='sticky right-0 font-medium'>{formatIntlNumber(total)}</TableCell>}
			</TableRow>
		</Table>
	)
}

const Table = tw.div`[&>*>:last-child]:top-0 [&>*>:first-child]:basis-28 [&>*>:first-child]:min-w-28 [&>*>:first-child]:bg-background [&>*>:first-child]:sticky [&>*>:first-child]:left-0 [&>*]:text-sm w-full overflow-x-auto`
const TableRow = tw.div`flex [&>*]:px-4 [&>:not(:last-child)]:border-l [&>*]:py-2 [&>*]:whitespace-nowrap [&>:last-child]:drop-shadow-[1px_0px_0px_hsl(var(--border))] [&>:first-child]:border-l-0 [&>:last-child]:border-r-0 [&>:last-child]:border-l [&>:last-child]:flex-1 [&>*]:basis-24 [&>*]:min-w-24`
const TableCell = tw.div`text-foreground text-left bg-background`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left bg-table-head`
const TableVerticalHeader = tw.div`sticky left-0 z-10 lowercase first-letter:uppercase !border-l-0 shadow-[1px_0px_hsl(var(--border))] font-medium`

export default SizeTable
