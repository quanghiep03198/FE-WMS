import formatIntlNumber from '@common/utils/format-intl-number'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@components/ui'
import type { IPurchaseOrder } from '@features/order/types'
import { sortBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
	NestedCell,
	NestedCellHead,
	NestedColumn,
	NestedTable
} from '../../../../components/shared/horizontal-nested-table'
import { useGetPurchaseOrderQuery } from '../../hooks/use-po-detail-request'
import EmptySearchResult from './empty-history'

const DataSection: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading } = useGetPurchaseOrderQuery()

	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IPurchaseOrder
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IPurchaseOrder[keyof IPurchaseOrder]) => string | number | React.ReactNode
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
				accessorKey: 'factory_shoes_style',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.color_sn'),
				accessorKey: 'color_sn',
				meta: { align: 'left' }
			},

			{
				header: t('ns_erp:fields.shipping_destination'),
				accessorKey: 'shipping_destination',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			},
			{
				header: t('ns_erp:fields.shipping_method'),
				accessorKey: 'shipping_method',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			},
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'order_qty',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			}
		],
		[i18n.language]
	)

	if (isLoading)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl items-center justify-center gap-x-2'>
				<Icon name='LoaderCircle' className='animate-spin' />
				<Typography variant='small'>{t('ns_common:status.loading')}</Typography>
			</Div>
		)

	if (!data) return <EmptySearchResult />

	return (
		<Div className='scrollbar-track-accent/50 @container relative max-h-96 overflow-auto rounded-lg border'>
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
								className='bg-table-row-active! text-table-head-foreground capitalize first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => {
							const cellValue =
								typeof column.cell === 'function'
									? column.cell(data[column.accessorKey])
									: data?.[column.accessorKey]
							return (
								<TableHead
									key={column.accessorKey}
									className='text-foreground font-normal first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10 last:font-medium'
									{...column.meta}>
									<span data-empty={!cellValue} className='data-[empty=true]:text-muted-foreground'>
										{cellValue ?? t('ns_common:titles.unknown')}
									</span>
								</TableHead>
							)
						})}
					</TableRow>
					<TableRow className='*:bg-table-row-active! *:capitalize'>
						<TableHead
							align='left'
							className='sticky! left-0 z-10'
							style={{ boxShadow: '1px 0px var(--border)', maxWidth: 200, minWidth: 200 }}>
							<span>{t('ns_erp:fields.mo_no')}</span>
						</TableHead>
						<TableHead colSpan={5} align='left' className='p-0'>
							<span className='sticky left-(--column-width) block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								Size
							</span>
						</TableHead>
						<TableHead align='left' className='sticky! right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.entries(data.packing).map(([manufacturingOrder, sizeRun]) => {
						const totalQty = Object.values(sizeRun).reduce((acc, curr) => acc + curr, 0)
						return (
							<TableRow key={manufacturingOrder}>
								<TableCell
									align='left'
									colSpan={1}
									className='sticky left-0 z-10'
									style={{ boxShadow: '1px 0px var(--border)' }}>
									<span>{manufacturingOrder}</span>
								</TableCell>
								<TableCell colSpan={5} className='p-0'>
									<NestedTable>
										{sortBy(Object.entries(sizeRun), (item) => item[0]).map(([size, qty]) => (
											<NestedColumn key={size} className='*:h-9'>
												<NestedCellHead>{size}</NestedCellHead>
												<NestedCell>{formatIntlNumber(qty)}</NestedCell>
											</NestedColumn>
										))}
									</NestedTable>
								</TableCell>
								<TableCell align='left' className='sticky! right-0 z-10 font-medium'>
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
