import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import useQueryParams from '@hooks/use-query-params'
import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SizeTable from '../../../../../components/shared/size-table'
import { useGetProductionInventoryQuery } from '../../../hooks/use-production-inventory-request'
import EmptyState from './empty-state'
import InboundOrderTable from './inbound-order-table'
import { OutboundEstimationTable } from './outbound-estimation-table'

const DataSection: React.FC = () => {
	const { searchParams } = useQueryParams<Record<'brand_name' | 'factory_shoes_style' | 'color_sn', string>>()
	const { t } = useTranslation()

	const { data, isLoading } = useGetProductionInventoryQuery()

	const shouldRender = !isEmpty(searchParams)

	const sizeData = useMemo(() => {
		// const currentSizeData = data?.sizes?.find((item) => item?.color === searchParams?.color_sn)
		const sizes = Array.isArray(data?.sizes) ? data.sizes : []
		const total = sizes.reduce((acc, item) => acc + (item?.qty || 0), 0)

		return { data: sizes, total }
	}, [data])

	console.log(data)

	if (isLoading)
		return (
			<Div className='flex h-48 items-center justify-center gap-x-2'>
				<Icon className='inline-block animate-spin' name='LoaderCircle' size={20} />
				<Typography color='muted' variant='small'>
					{t('ns_common:status.loading')}
				</Typography>
			</Div>
		)
	else if (!shouldRender) return <EmptyState />
	else if (shouldRender)
		return (
			<Div className='animate-in fade-in-0 grid grid-cols-1 gap-6 transition-opacity duration-300 ease-out @7xl:grid-cols-2'>
				<Div className='col-span-1'>
					<InboundOrderTable data={data?.inbound!} />
				</Div>
				<Div className='col-span-1'>
					<OutboundEstimationTable data={data?.outbound!} />
				</Div>
				<Div className='relative col-span-full space-y-4 rounded-md border p-4 shadow-sm overflow-hidden'>
					<SizeTable data={sizeData.data!} total={sizeData.total} />
					<Typography className='block text-center' color='muted' variant='small'>
						{t('ns_inoutbound:description.size_qty_caption')}
					</Typography>
				</Div>
			</Div>
		)
	else return null
}

export default DataSection
