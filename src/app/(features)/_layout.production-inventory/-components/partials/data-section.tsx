import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Icon, Typography } from '@/components/ui'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetProductionInventoryQuery } from '../../-hooks/use-production-inventory-asm'
import SizeTable from '../../../-components/-shared/size-table'
import { useGetTenantByFactory } from '../../../-hooks/use-tenacy-asm'
import EmptyState from './empty-state'
import InboundOrderTable from './inbound-order-table'
import { OutboundEstimationTable } from './outbound-estimation-table'

const DataSection: React.FC = () => {
	const { searchParams } = useQueryParams<Record<'brand_name' | 'shoes_style' | 'color', string>>()
	const { data: tenant } = useGetTenantByFactory()
	const { t } = useTranslation()

	const { data, isLoading } = useGetProductionInventoryQuery(tenant?.id, searchParams)

	const shouldRender = !isEmpty(searchParams)

	const sizeData = useMemo(() => {
		const currentSizeData = data?.sizes?.find((item) => item?.color === searchParams?.color)
		return { data: currentSizeData?.inv_sizes ?? [], total: currentSizeData?.total_qty || 0 }
	}, [data])

	if (isLoading)
		return (
			<Div className='flex h-48 items-center justify-center gap-x-2'>
				<Icon name='LoaderCircle' size={20} className='inline-block animate-[spin_1s_linear_infinite]' />
				<Typography variant='small' color='muted'>
					{t('ns_common:status.loading')}
				</Typography>
			</Div>
		)
	else if (!shouldRender) return <EmptyState />
	else if (shouldRender)
		return (
			<Div className='grid grid-cols-1 gap-6 transition-opacity duration-300 ease-out animate-in fade-in-0 @7xl:grid-cols-2'>
				<Div className='col-span-1'>
					<InboundOrderTable data={data?.inbound} />
				</Div>
				<Div className='col-span-1'>
					<OutboundEstimationTable data={data?.outbound} />
				</Div>
				<Div className='relative col-span-full space-y-4 rounded-md border p-4 shadow-sm'>
					<SizeTable data={sizeData.data} total={sizeData.total} />
					<Typography variant='small' color='muted' className='block text-center'>
						{t('ns_inoutbound:description.size_qty_caption')}
					</Typography>
				</Div>
			</Div>
		)
	else return null
}

export default DataSection
