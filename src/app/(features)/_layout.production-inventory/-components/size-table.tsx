import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type SizeTableProps = {
	data: Array<{ size_numcode: string; qty: number }>
	total?: number
}

const SizeTable: React.FC<SizeTableProps> = ({ data, total }) => {
	const { t } = useTranslation()

	return (
		<Table>
			<TableRow>
				{data.map((item) => (
					<Fragment key={item.size_numcode}>
						<TableCellHead variant='small'>{item.size_numcode}</TableCellHead>
					</Fragment>
				))}
				{total && <TableCellHead className='sticky right-0'>{t('ns_common:common_fields.total')}</TableCellHead>}
			</TableRow>
			<TableRow>
				{data.map((item) => (
					<TableCell key={item.size_numcode}>{item.qty}</TableCell>
				))}
				{total && <TableCell className='sticky right-0'>{total}</TableCell>}
			</TableRow>
		</Table>
	)
}

const Table = tw.div`[&>*>:last-child]:top-0 [&>*>:last-child]:font-medium divide-y border [&>*]:text-sm overflow-x-auto w-full rounded-md`
const TableRow = tw.div`flex [&>*]:px-4 [&>:not(:last-child)]:border-r [&>*]:py-2 [&>*]:whitespace-nowrap [&>:last-child]:border-r-0 [&>:last-child]:flex-1 [&>*]:basis-16 [&>*]:min-w-16`
const TableCell = tw.div`text-foreground text-left`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left bg-table-head`

export default SizeTable
