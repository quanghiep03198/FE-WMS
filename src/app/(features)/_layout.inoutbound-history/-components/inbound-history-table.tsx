import { IInboundHistory } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import { orderBy, sortBy } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import { NestedCell, NestedCellHead, NestedRow, NestedTable } from '../../-components/-shared/horizontal-nested-table'
import PlaceHolderItems from '../../-components/-shared/placeholder-items'

const InboundHistoryTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetInboundHistoryQuery()
	const { t, i18n } = useTranslation()

	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IInboundHistory
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IInboundHistory[keyof IInboundHistory]) => string | number | React.ReactNode
		}>
	>(
		() => [
			{ header: t('ns_erp:fields.mo_no'), accessorKey: 'mo_no', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.brand_name'), accessorKey: 'brand_name', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.shoestyle_codefactory'), accessorKey: 'shoe_style', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.mo_qty'),
				accessorKey: 'mo_qty',
				meta: { align: 'right' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.accumulated_qty'),
				accessorKey: 'accumulated_inbound_qty',
				meta: { align: 'right' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.missing_qty'),
				accessorKey: 'missing_qty',
				meta: { align: 'right' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.progress'),
				accessorKey: 'progress',
				meta: { align: 'right' }
			}
		],
		[i18n.language]
	)

	if (isLoading)
		return (
			<Div className='h-20 place-content-center text-center text-muted-foreground'>
				<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
			</Div>
		)

	if (!data)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl flex-col items-center justify-center rounded-lg border-2 border-dashed p-6'>
				<PlaceHolderItems />
				<Typography variant='small' color='muted'>
					{t('ns_common:table.no_data')}
				</Typography>
			</Div>
		)

	return (
		<Div className='relative h-[50vh] overflow-auto rounded-lg border'>
			<Table className='table-fixed border-separate border-spacing-0 [&_span]:line-clamp-1'>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.accessorKey} title={column.header} {...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.accessorKey} {...column.meta} className='font-normal text-foreground'>
								<span>
									{typeof column.cell === 'function'
										? column.cell(data[column.accessorKey])
										: data[column.accessorKey].toString()}
								</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						<TableHead align='left' className='sticky left-0 z-10'>
							{t('ns_erp:fields.inbound_date')}
						</TableHead>
						<TableHead colSpan={6}>{t('ns_erp:fields.daily_inbound_qty')}</TableHead>
						<TableHead align='right' className='!sticky right-0 z-10'>
							{t('ns_common:common_fields.total')}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(
						Object.groupBy(
							orderBy(data.inbound_history, 'inbound_date', 'desc'),
							(item) => item.inbound_date as string
						)
					).map(([date, history]) => {
						const totalQty = history.reduce((acc, curr) => acc + curr.qty, 0)
						return (
							<TableRow key={date}>
								<TableCell align='left' colSpan={1} className='sticky left-0 z-10'>
									{date}
								</TableCell>
								<TableCell colSpan={6} className='p-0'>
									<NestedTable>
										{sortBy(history, 'size_numcode').map((item) => (
											<NestedRow key={item.size_numcode}>
												<NestedCellHead>{item.size_numcode}</NestedCellHead>
												<NestedCell>{item.qty}</NestedCell>
											</NestedRow>
										))}
									</NestedTable>
								</TableCell>
								<TableCell align='right' className='sticky right-0 z-10 font-medium'>
									{formatIntlNumber(totalQty)}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</Div>
	)
}

export default InboundHistoryTable
