import formatIntlNumber from '@/common/utils/format-intl-number'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

type SizeTableProps = {
	data: Array<{ size_numcode: string; qty: number }>
	total?: number
}

const SizeTable: React.FC<SizeTableProps> = ({ data, total }) => {
	const { t } = useTranslation()

	return (
		<Table className='w-full table-fixed rounded-sm'>
			{!Array.isArray(data) || data.length === 0 ? (
				<TableBody>
					<TableRow>
						<TableCell
							colSpan={'100%' as unknown as React.TdHTMLAttributes<HTMLTableCellElement>['colSpan']}
							align='center'
							className='h-[72px] text-muted-foreground'>
							{t('ns_common:table.no_data')}
						</TableCell>
					</TableRow>
				</TableBody>
			) : (
				<Fragment>
					<TableHeader className='border-b'>
						<TableRow className='divide-x [&_th>span]:line-clamp-1 [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
							{data?.map((item, index) => (
								<TableHead
									key={index.toString()}
									align='left'
									className='w-full max-w-20 bg-table-head text-table-head-foreground'>
									{item?.size_numcode}
								</TableHead>
							))}
							{total && (
								<TableHead align='left' className='sticky right-0 z-10'>
									<span> {t('ns_common:common_fields.total')}</span>
								</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className='divide-x'>
							{data?.map((item, index) => (
								<TableCell key={index.toString()} align='left' className='w-20'>
									{formatIntlNumber(item.qty)}
								</TableCell>
							))}
							{total && (
								<TableCell align='left' className='sticky right-0 z-10 font-medium'>
									{formatIntlNumber(total)}
								</TableCell>
							)}
						</TableRow>
					</TableBody>
				</Fragment>
			)}
		</Table>
	)
}

export default SizeTable
