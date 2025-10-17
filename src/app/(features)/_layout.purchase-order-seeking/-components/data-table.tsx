import useQueryParams from '@/common/hooks/use-query-params'
import { IPurchaseOrderDetail } from '@/common/types/entities'
import {
	Badge,
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { OrderService } from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import PlaceHolderItems from '../../-components/-shared/placeholder-items'
import SizeTable from '../../_layout.production-inventory/-components/partials/size-table'

const DataTable: React.FC = () => {
	const { t, i18n } = useTranslation()

	const { searchParams } = useQueryParams<{ po?: string }>()

	const { data, isLoading } = useQuery({
		queryKey: ['PURCHASE_ORDER_SEEKING', searchParams.po],
		queryFn: async () => await OrderService.getPurchaseOrderSizeRun(searchParams.po),
		enabled: !!searchParams.po,
		select: (response) => response.metadata
	})

	const columns: Array<{ header: string; accessorKey: keyof IPurchaseOrderDetail }> = useMemo(
		() => [
			{ header: t('ns_erp:fields.po'), accessorKey: 'po' },
			{ header: t('ns_erp:fields.mo_no'), accessorKey: 'mo_no' },
			{ header: t('ns_erp:fields.brand_name'), accessorKey: 'brand_name' },
			{ header: t('ns_erp:fields.shoestyle_codefactory'), accessorKey: 'shoes_style' },
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color_sn' },
			{ header: t('ns_erp:fields.shipping_id'), accessorKey: 'ship_id' },
			{ header: t('ns_erp:fields.shipping_destination'), accessorKey: 'ship_dest_country' },
			{ header: t('ns_erp:fields.shipping_type'), accessorKey: 'ship_type' }
		],
		[i18n.language]
	)

	if (!data)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed bg-background p-6 text-center text-muted-foreground'>
				<PlaceHolderItems />
				<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
				<Typography variant='small' color='muted' className='mx-auto max-w-xl text-pretty text-center'>
					{t('ns_erp:descriptions.no_purchase_order_found')}
				</Typography>
			</Div>
		)

	if (isLoading)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl items-center justify-center gap-x-2'>
				<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
				<Typography variant='small'>{t('ns_common:status.loading')}</Typography>
			</Div>
		)

	return (
		<Div as='section' className='overflow-clip rounded-md border'>
			<Table className='table-fixed [&_tr_*>span]:line-clamp-1'>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead align='left' key={column.accessorKey} title={column.header}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						{columns
							.filter((column) => column.accessorKey !== 'sizes')
							.map((column) => {
								if (column.accessorKey === 'mo_no')
									return (
										<TableCell key={column.accessorKey} align='left'>
											<EllipsisList
												data={data?.mo_no?.split(',') ?? []}
												threshhold={1}
												template={({ data }) => <Badge variant='outline'>{data}</Badge>}
											/>
										</TableCell>
									)
								return (
									<TableCell key={column.accessorKey} align='left'>
										<span>{String(data[column.accessorKey])}</span>
									</TableCell>
								)
							})}
					</TableRow>
					<TableRow>
						<TableHead colSpan={8} align='center'>
							{t('ns_erp:fields.po_size_qty')}
						</TableHead>
					</TableRow>
					<TableRow>
						<TableCell colSpan={8} className='!p-0'>
							<SizeTable data={data.sizes} />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Div>
	)
}

export default DataTable
