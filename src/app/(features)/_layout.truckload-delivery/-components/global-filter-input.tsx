'use no memo'

import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Div, Icon } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { capitalize } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

const GlobalFilterInput: React.FC<{
	table: Table<ITruckloadDelivery>
	event$: EventEmitter<Record<string, unknown>>
}> = ({ table }) => {
	const { t } = useTranslation()
	const isMediumScreen = useMediaQuery(PresetBreakPoints.MEDIUM)

	return (
		<Div className='flex h-9 items-center gap-x-1 rounded-md border px-3 shadow-sm'>
			<Icon name='Search' />
			<DebouncedInput
				value={table.getState().globalFilter}
				onChange={(value) => {
					table.setGlobalFilter(String(value))
				}}
				className='h-full min-w-44 p-0 pl-2 shadow-none placeholder:text-sm xl:min-w-56'
				placeholder={
					isMediumScreen
						? t('ns_common:actions.search') + ' ...'
						: capitalize(t('ns_erp:fields.license_plate') + '/' + t('ns_erp:fields.container_number'))
				}
				type='search'
			/>
		</Div>
	)
}

export default GlobalFilterInput
