'use no memo'

import { Div } from '@components/customs/div'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { matchQuery, useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePageQueryParams } from '../hooks/use-page-query-params'
import { TruckloadDeliveryQueryKeys } from '../hooks/use-truckload-delivery-request'
import { type ITruckloadDelivery } from '../types'
import DownloadExcelButton from './download-excel-button'
import GlobalFilter from './global-filter'
import { TableViewOptions } from './table-view-options'

const TruckloadDeliveryTableToolbar: React.FC<{ table: Table<ITruckloadDelivery> }> = ({ table }) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { searchParams } = usePageQueryParams()

	return (
		<Div className='flex items-center justify-end gap-x-2'>
			<GlobalFilter />
			<Button
				className='ml-auto'
				size='default'
				variant='outline'
				onClick={() =>
					queryClient.refetchQueries({
						predicate: (query) =>
							matchQuery({ queryKey: [TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY, searchParams] }, query)
					})
				}>
				<Icon name='RefreshCcw' /> {t('ns_common:actions.reload')}
			</Button>
			<TableViewOptions table={table} />
			<DownloadExcelButton />
		</Div>
	)
}

export default TruckloadDeliveryTableToolbar
