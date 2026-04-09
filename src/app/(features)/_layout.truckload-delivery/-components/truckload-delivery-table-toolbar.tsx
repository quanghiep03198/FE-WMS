'use no memo'

import { Button, Div, Icon } from '@/components/ui'
import { type ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { type Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import DownloadExcelButton from './download-excel-button'
import GlobalFilter from './global-filter'
import { TableViewOptions } from './table-view-options'

const TruckloadDeliveryTableToolbar: React.FC<{ table: Table<ITruckloadDelivery> }> = ({ table }) => {
	const { t } = useTranslation()
	const { refetch } = useGetTruckloadDeliveryQuery()

	return (
		<Div className='flex items-center justify-end gap-x-2'>
			<GlobalFilter />
			<Button variant='outline' size='default' className='ml-auto' onClick={() => refetch()}>
				<Icon name='RefreshCcw' /> {t('ns_common:actions.reload')}
			</Button>
			<TableViewOptions table={table} />
			<DownloadExcelButton />
		</Div>
	)
}

export default TruckloadDeliveryTableToolbar
