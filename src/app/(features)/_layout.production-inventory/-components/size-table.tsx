import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div } from '@/components/ui'
import React, { Fragment } from 'react'
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

	return (
		<Table {...props}>
			<TableRow>
				<TableCellHead className='text-foreground'>Size</TableCellHead>
				{data.map((item) => (
					<Fragment key={item.size_numcode}>
						<TableCellHead variant='small'>{item.size_numcode}</TableCellHead>
					</Fragment>
				))}
				{total && (
					<TableCellHead className='sticky right-0 bg-background font-medium text-foreground'>
						{t('ns_common:common_fields.total')}
					</TableCellHead>
				)}
			</TableRow>
			<TableRow>
				<TableCellHead className='text-foreground'>{t('ns_common:common_fields.quantity')}</TableCellHead>
				{data.map((item) => (
					<TableCell key={item.size_numcode}>{formatIntlNumber(item.qty)}</TableCell>
				))}
				{total && <TableCell className='sticky right-0 font-medium'>{formatIntlNumber(total)}</TableCell>}
			</TableRow>
		</Table>
	)
}

const Table = tw.div`[&>*>:last-child]:top-0 [&>*>:first-child]:basis-28 [&>*>:first-child]:bg-background [&>*>:first-child]:sticky [&>*>:first-child]:left-0 divide-y [&>*]:text-sm overflow-x-auto w-full rounded-md`
const TableRow = tw.div`flex [&>*]:px-4 [&>:not(:last-child)]:border-r [&>*]:py-2 [&>*]:whitespace-nowrap [&>:last-child]:border-r-0 [&>:last-child]:flex-1 [&>*]:basis-16 [&>*]:min-w-16`
const TableCell = tw.div`text-foreground text-left bg-background`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left bg-table-head`

export default SizeTable
