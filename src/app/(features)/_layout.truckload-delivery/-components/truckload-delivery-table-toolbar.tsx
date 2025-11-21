'use no memo'

import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, Div, Icon } from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import DispatchOrderStatusFilter from './dispatch-order-status-filter'
import GlobalFilterInput from './global-filter-input'
import PurchaseOrderFilterInput from './purchase-order-filter-input'

const TruckloadDeliveryTableToolbar: React.FC<{
	table: Table<ITruckloadDelivery>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table, event$ }) => {
	const { t } = useTranslation()
	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)
	const { refetch } = useGetTruckloadDeliveryQuery()
	const { globalFilter, columnFilters } = table.getState()
	const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

	return (
		<Div className='flex items-center gap-x-1'>
			<GlobalFilterInput {...{ table, event$ }} />
			{!isMediumScreen && <PurchaseOrderFilterInput table={table} />}
			<DispatchOrderStatusFilter table={table} />
			<Div className='ml-auto flex items-center justify-end gap-x-1'>
				{isFilterDirty && (
					<Button
						variant='destructive'
						onClick={() => {
							table.resetGlobalFilter(table.initialState.globalFilter)
							table.resetColumnFilters(true)
						}}>
						<Icon name='FunnelX' /> {t('ns_common:actions.clear_filter')}
					</Button>
				)}
				<Button variant='outline' onClick={() => refetch()}>
					<Icon name='RotateCw' /> {t('ns_common:actions.reload')}
				</Button>
			</Div>
		</Div>
	)
}

export default TruckloadDeliveryTableToolbar
