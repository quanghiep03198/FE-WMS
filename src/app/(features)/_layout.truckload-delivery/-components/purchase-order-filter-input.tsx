'use no memo'

import { Div, Icon } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import { capitalize } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PurchaseOrderFilterInput: React.FC<{
	table: Table<ITruckloadDelivery>
}> = ({ table }) => {
	const { t } = useTranslation()

	return (
		<Div className='flex h-9 items-center gap-x-1 rounded-md border px-3 shadow-sm'>
			<Icon name='Search' />
			<DebouncedInput
				value={(table.getColumn('po').getFilterValue() as string) ?? ''}
				onChange={(value) => {
					// event$.emit(pick(table.getState(), ['rowSelection']))
					table.getColumn('po').setFilterValue(value)
				}}
				className='h-full min-w-48 p-0 pl-2 shadow-none placeholder:text-sm'
				placeholder={capitalize(
					t('ns_common:form_placeholder.search', { object: t('ns_erp:fields.po'), defaultValue: null })
				)}
				type='search'
			/>
		</Div>
	)
}

export default PurchaseOrderFilterInput
