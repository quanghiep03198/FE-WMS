import { IInboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundReportByCommandNumber } from '../-hooks/use-inoutbound-progress'
import SizeTable from '../../_layout.production-inventory/-components/partials/size-table'

type Props = {}

const InboundReportTable = (props: Props) => {
	const { data, isLoading, refetch } = useGetInboundReportByCommandNumber()
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IInboundReport>>(null)
	const columnHelper = createColumnHelper<IInboundReport>()

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	return (
		<Div className='overflow-clip rounded-md border'>
			<Table className='table-fixed'>
				<TableHeader>
					<TableRow className='[&_th]:bg-table-head'>
						<TableHead align='left'>{t('ns_erp:fields.brand_name')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.mo_no')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.shoestyle_codefactory')}</TableHead>
						<TableHead align='left'>{t('ns_erp:fields.color_sn')}</TableHead>
						<TableHead align='right'>{t('ns_erp:fields.order_qty')}</TableHead>
						<TableHead align='right'>{t('ns_erp:fields.inbound_qty')}</TableHead>
						<TableHead align='right'>{t('ns_erp:fields.missing_qty')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell>
								<Skeleton />
							</TableCell>
						</TableRow>
					) : Array.isArray(data) && data.length > 0 ? (
						data.map((item, index) => (
							<Fragment key={index}>
								<TableRow>
									<TableCell align='left'>{item.brand_name}</TableCell>
									<TableCell align='left'>{item.mo_no}</TableCell>
									<TableCell align='left'>{item.shoes_style_code_factory}</TableCell>
									<TableCell align='left'>{item.color_sn}</TableCell>
									<TableCell align='right'>{formatIntlNumber(item.order_qty)}</TableCell>
									<TableCell align='right'>{formatIntlNumber(item.inbound_qty)}</TableCell>
									<TableCell align='right'>{formatIntlNumber(item.missing_qty ?? 0)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell colSpan={7} className='bg-accent/25 p-6'>
										<SizeTable data={item.size_data} />
									</TableCell>
								</TableRow>
							</Fragment>
						))
					) : null}
				</TableBody>
			</Table>
		</Div>
	)
}

export default InboundReportTable
