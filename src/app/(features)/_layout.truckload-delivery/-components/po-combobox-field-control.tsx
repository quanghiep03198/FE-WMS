'use no memo'

import { useSearchPurchaseOrderQuery } from '@/app/(features)/-hooks/use-order-asm'
import { CommonActions } from '@/common/constants/enums'
import { ComboboxFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { useDebounce } from 'ahooks'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import { CreateDeliveryFormValues, UpdateDeliveryFormValues } from '../-schemas'

type PoComboboxFieldControlProps = Partial<
	ComboboxFieldControlProps<{
		po: string
		po_qty: number
		accumulated_outbound_qty: number
		is_completed: boolean
	}>
> & { ['data-action']: CommonActions.CREATE | CommonActions.UPDATE; ['data-index']?: number }

const PoComboboxFieldControl: React.FC<PoComboboxFieldControlProps> = ({ name, ...props }) => {
	const { t } = useTranslation()
	const { setValue } = useFormContext<CreateDeliveryFormValues | UpdateDeliveryFormValues>()
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchPurchaseOrderQuery(debouncedSearchTerm)
	const { data } = useGetTruckloadDeliveryQuery()

	const handleSelect = (value: string) => {
		const matchPurchaseOrder = purchaseOrders.find((item) => item.po === value)
		if (!matchPurchaseOrder) return

		const alreadyAddedOutboundQty = data
			.filter((item) => {
				if (props['data-action'] === CommonActions.UPDATE) return item.po === value && item.id !== props['data-id']
				return item.po === value
			})
			.reduce((acc, curr) => acc + curr.outbound_qty, 0)
		const { po_qty: purchaseOrderQty, accumulated_outbound_qty: accumulatedOutboundQty } = matchPurchaseOrder

		if (typeof props['data-index'] === 'number')
			setValue(
				`outbound_purchase_orders.${props['data-index']}.max_outbound_qty`,
				purchaseOrderQty - accumulatedOutboundQty - alreadyAddedOutboundQty
			)
		else setValue('max_outbound_qty', purchaseOrderQty - accumulatedOutboundQty - alreadyAddedOutboundQty)
	}

	return (
		<ComboboxFieldControl
			name={name}
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			shouldFilter={false}
			labelField='po'
			valueField='po'
			loading={isLoading}
			datalist={purchaseOrders}
			onInput={setSearchTerm}
			onSelect={handleSelect}
			{...props}
		/>
	)
}

export default PoComboboxFieldControl
