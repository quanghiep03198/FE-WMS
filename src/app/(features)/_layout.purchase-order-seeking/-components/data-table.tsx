import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { OrderService } from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import SizeTable from '../../_layout.production-inventory/-components/partials/size-table'

const DataTable: React.FC = () => {
	const { t } = useTranslation()

	const { searchParams } = useQueryParams<{ po?: string }>()

	const { data, isLoading } = useQuery({
		queryKey: ['PURCHASE_ORDER_SEEKING', searchParams.po],
		queryFn: async () => await OrderService.getPurchaseOrderSizeRun(searchParams.po),
		enabled: !!searchParams.po,
		select: (response) => response.metadata
	})

	return (
		<Div as='section' className='overflow-clip rounded-md border'>
			<Table className='table-fixed'>
				<colgroup>
					{Array.from({ length: 4 }).map((_, index) => {
						return <col key={index} className='w-[25%]' />
					})}
				</colgroup>
				<TableHeader>
					<TableRow>
						<TableHead align='left'>{t('ns_erp:fields.po')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.brand_name')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.shoestyle_codefactory')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.color_sn')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<Fragment>
							<TableRow>
								<TableCell>
									<Skeleton />
								</TableCell>
								<TableCell>
									<Skeleton />
								</TableCell>
								<TableCell>
									<Skeleton />
								</TableCell>
								<TableCell>
									<Skeleton />
								</TableCell>
							</TableRow>
						</Fragment>
					) : (
						<Fragment>
							<TableRow>
								<TableCell align='left'>{data?.po}</TableCell>
								<TableCell align='left'>{data?.brand_name}</TableCell>
								<TableCell align='left'>{data?.shoes_style}</TableCell>
								<TableCell align='left'>{data?.color_sn}</TableCell>
							</TableRow>
							<TableRow>
								<TableHead colSpan={4} align='center'>
									{t('ns_erp:fields.po_size_qty')}
								</TableHead>
							</TableRow>
							<TableRow>
								<TableCell colSpan={4} className='!p-0'>
									<SizeTable data={data.sizes} />
								</TableCell>
							</TableRow>
						</Fragment>
					)}
				</TableBody>
			</Table>
		</Div>
	)
}

export default DataTable
