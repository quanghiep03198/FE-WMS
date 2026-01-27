import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, Div, Icon, Tooltip } from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import { useUpdateEffect } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { pick } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePageQueryParams } from '../-hooks/use-page-query-params'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import CreateTruckloadDialogButton from './create-truckload-delivery-button'
import DispatchOrderStatusFilter from './dispatch-order-status-filter'
import DownloadExcelButton from './download-excel-button'
import GlobalFilterInput from './global-filter-input'
import PurchaseOrderFilterInput from './purchase-order-filter-input'

const TruckloadDeliveryTableToolbar: React.FC<{
	table: Table<ITruckloadDelivery>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table, event$ }) => {
	const { t } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { refetch } = useGetTruckloadDeliveryQuery()
	const { searchParams, removeParam } = usePageQueryParams()
	const { globalFilter, columnFilters } = table.getState()
	const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

	useUpdateEffect(() => {
		if (searchParams.from || searchParams.to)
			table.getColumn('created_at').setFilterValue(pick(searchParams, ['from', 'to']))
		else table.getColumn('created_at').setFilterValue(undefined)
	}, [searchParams])

	return (
		<Div className='flex items-center gap-x-2 sm:gap-x-1 md:gap-x-1'>
			<GlobalFilterInput {...{ table, event$ }} />
			{!isMobile && <PurchaseOrderFilterInput table={table} />}
			<DispatchOrderStatusFilter table={table} />
			<Div className='ml-auto flex items-center justify-end gap-x-2 sm:gap-x-1 md:gap-x-1'>
				{isFilterDirty && (
					<Tooltip
						message={t('ns_common:actions.clear_filter')}
						triggerProps={{ asChild: true }}
						contentProps={{ hidden: !isMobile }}>
						<Button
							variant='destructive'
							size={isMobile ? 'icon' : 'default'}
							onClick={() => {
								table.resetGlobalFilter(table.initialState.globalFilter)
								table.resetColumnFilters(true)
								removeParam('from')
								removeParam('to')
								removeParam('status')
							}}>
							<Icon name='FunnelX' /> {!isMobile && t('ns_common:actions.clear_filter')}
						</Button>
					</Tooltip>
				)}
				<Tooltip
					message={t('ns_common:actions.reload')}
					triggerProps={{ asChild: true }}
					contentProps={{ hidden: !isMobile }}>
					<Button variant='outline' size={isMobile ? 'icon' : 'default'} onClick={() => refetch()}>
						<Icon name='RotateCw' /> {!isMobile && t('ns_common:actions.reload')}
					</Button>
				</Tooltip>
				{isMobile && (
					<Tooltip
						message={t('ns_common:actions.download_excel')}
						triggerProps={{ asChild: true }}
						contentProps={{ hidden: !isMobile }}>
						<DownloadExcelButton />
					</Tooltip>
				)}
				<Tooltip
					message={t('ns_common:actions.add')}
					triggerProps={{ asChild: true }}
					contentProps={{ hidden: !isMobile }}>
					<CreateTruckloadDialogButton />
				</Tooltip>
			</Div>
		</Div>
	)
}

export default TruckloadDeliveryTableToolbar
