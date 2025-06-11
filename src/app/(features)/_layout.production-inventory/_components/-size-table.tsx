import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

type SizeTableProps = {
	data: Array<{ size_numcode: string; qty: number }>
	total: number
}

const SizeTable: React.FC<SizeTableProps> = ({ data, total }) => {
	const { t } = useTranslation()

	return (
		<Div className='max-w-full rounded-sm border p-4 shadow-sm xxl:p-6'>
			<Div className='max-w-full overflow-x-auto rounded'>
				<Table className='table-fixed rounded'>
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
								<TableRow className='divide-x'>
									{data?.map((item, index) => (
										<TableHead
											key={index.toString()}
											align='left'
											className='w-20 bg-table-head text-table-head-foreground'>
											{item?.size_numcode}
										</TableHead>
									))}
									<TableHead
										align='left'
										className='sticky right-0 z-10 whitespace-nowrap bg-table-head text-table-head-foreground'>
										{t('ns_common:common_fields.total')}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className='divide-x'>
									{data?.map((item, index) => (
										<TableCell key={index.toString()} align='left' className='w-20'>
											{formatIntlNumber(item.qty)}
										</TableCell>
									))}
									<TableCell align='left' className='sticky right-0 z-10 whitespace-nowrap font-medium'>
										{formatIntlNumber(total)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Fragment>
					)}
				</Table>
			</Div>
		</Div>
	)
}

export default SizeTable
