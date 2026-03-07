import { IPurchaseOrderDetail } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import { groupBy, orderBy, sortBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePurchaseOrderDetailQuery } from '../-hooks/use-po-detail-asm'
import { NestedCell, NestedCellHead, NestedColumn, NestedTable } from '../../-components/shared/horizontal-nested-table'
import EmptySearchResult from './empty-history'

const DataSection: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading } = usePurchaseOrderDetailQuery()

	const orderQty = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return formatIntlNumber(data.reduce((acc, curr) => acc + curr.qty, 0))
	}, [data])

	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IPurchaseOrderDetail
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IPurchaseOrderDetail[keyof IPurchaseOrderDetail]) => string | number | React.ReactNode
		}>
	>(
		() => [
			{
				header: t('ns_erp:fields.po'),
				accessorKey: 'po',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.brand_name'),
				accessorKey: 'brand_name',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.factory_shoes_style'),
				accessorKey: 'shoes_style',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.color_sn'),
				accessorKey: 'color_sn',
				meta: { align: 'left' }
			},

			{
				header: t('ns_erp:fields.shipping_destination'),
				accessorKey: 'ship_dest_country',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			},
			{
				header: t('ns_erp:fields.shipping_type'),
				accessorKey: 'ship_type',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			},
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'qty',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } },
				cell: () => <span className='font-medium'>{orderQty}</span>
			}
		],
		[orderQty, i18n.language]
	)

	const sizeQtyByOrder = useMemo(() => {
		if (!data) return []
		return Object.entries(groupBy(orderBy(data, 'mo_no', 'asc'), (item) => item.mo_no))
	}, [data])

	if (isLoading)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl items-center justify-center gap-x-2'>
				<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
				<Typography variant='small'>{t('ns_common:status.loading')}</Typography>
			</Div>
		)

	if (!Array.isArray(data) || !data.length) return <EmptySearchResult />

	return (
		<Div className='relative max-h-96 overflow-auto rounded-lg border scrollbar-track-accent/50 @container'>
			<Table
				className='table-auto [&_span]:line-clamp-1'
				style={{ '--column-width': '200px' } as React.CSSProperties}>
				<colgroup>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
					<col
						style={{
							minWidth: 'var(--column-width)',
							maxWidth: 'var(--column-width)'
						}}
					/>
				</colgroup>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								title={column.header}
								className='!bg-table-row-active capitalize text-table-head-foreground first:!sticky first:left-0 first:z-10 first:shadow-[1px_0px_hsl(var(--border))] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => {
							const [rowData] = data
							const cellValue =
								typeof column.cell === 'function'
									? column.cell(rowData[column.accessorKey])
									: rowData?.[column.accessorKey]
							return (
								<TableHead
									key={column.accessorKey}
									className='font-normal text-foreground first:!sticky first:left-0 first:z-10 first:shadow-[1px_0px_hsl(var(--border))] last:sticky last:right-0 last:z-10'
									{...column.meta}>
									<span data-empty={!cellValue} className='data-[empty=true]:text-muted-foreground'>
										{cellValue ?? t('ns_common:titles.unknown')}
									</span>
								</TableHead>
							)
						})}
					</TableRow>
					<TableRow className='[&>*]:!bg-table-row-active [&>*]:capitalize'>
						<TableHead
							align='left'
							className='!sticky left-0 z-10'
							style={{ boxShadow: '1px 0px hsl(var(--border))', maxWidth: 200, minWidth: 200 }}>
							<span>{t('ns_erp:fields.mo_no')}</span>
						</TableHead>
						<TableHead colSpan={5} align='left' className='p-0'>
							<span className='sticky left-[var(--column-width)] block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								Size
							</span>
						</TableHead>
						<TableHead align='left' className='!sticky right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sizeQtyByOrder.map(([date, history]) => {
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
								<TableCell colSpan={5} className='p-0'>
									<NestedTable>
										{sortBy(history, 'size_numcode').map((item) => (
											<NestedColumn key={item.size_numcode} className='[&>*]:h-9'>
												<NestedCellHead>{item.size_numcode}</NestedCellHead>
												<NestedCell>{formatIntlNumber(item.qty)}</NestedCell>
											</NestedColumn>
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

export default DataSection
