import { IInboundHistory } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import { orderBy, sortBy } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import { NestedCell, NestedCellHead, NestedRow, NestedTable } from '../../-components/shared/horizontal-nested-table'
import PlaceHolderItems from '../../-components/shared/placeholder-items'

const InboundHistoryTable: React.FC = () => {
	const { data, isLoading } = useGetInboundHistoryQuery()
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
			{ header: t('ns_erp:fields.factory_shoes_style'), accessorKey: 'shoe_style', meta: { align: 'left' } },
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
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			}
		],
		[i18n.language]
	)

	if (isLoading)
		return (
			<Div className='h-20 w-full place-content-center place-items-center text-center text-muted-foreground'>
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
			<Table className='w-full table-auto border-separate border-spacing-0 [&_span]:line-clamp-1'>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								title={column.header}
								style={{ maxWidth: 200, minWidth: 200 }}
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								style={{ maxWidth: 200, minWidth: 200 }}
								className='font-normal text-foreground'
								{...column.meta}>
								<span>
									{typeof column.cell === 'function'
										? column.cell(data[column.accessorKey])
										: data[column.accessorKey]?.toString?.()}
								</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						<TableHead
							align='left'
							className='!sticky left-0 z-10'
							style={{ boxShadow: '1px 0px hsl(var(--border))' }}>
							<span>{t('ns_erp:fields.inbound_date')}</span>
						</TableHead>
						<TableHead colSpan={6}>
							<span>{t('ns_erp:fields.daily_inbound_qty')}</span>
						</TableHead>
						<TableHead align='left' className='!sticky right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
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
								<TableCell
									align='left'
									colSpan={1}
									className='sticky left-0 z-10'
									style={{ boxShadow: '1px 0px hsl(var(--border))' }}>
									<span>{date}</span>
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
								<TableCell align='left' className='!sticky right-0 z-10 font-medium'>
									<span>{formatIntlNumber(totalQty)}</span>
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
