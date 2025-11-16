'use no memo'

import { useSearchPurchaseOrderQuery } from '@/app/(features)/-hooks/use-order-asm'
import { CommonActions } from '@/common/constants/enums'
import { ComboboxFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { useDebounce } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import { CreateDeliveryFormValues, UpdateDeliveryFormValues } from '../-schemas'

type PurchaseOrderFieldControlProps = Partial<
	ComboboxFieldControlProps<{
		po: string
		po_qty: number
		accumulated_outbound_qty: number
		is_completed: boolean
	}>
> & { ['data-action']: CommonActions.CREATE | CommonActions.UPDATE; ['data-index']?: number }

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = ({ name, ...props }) => {
	const { t } = useTranslation()
	const { control, getValues, setValue } = useFormContext<CreateDeliveryFormValues | UpdateDeliveryFormValues>()
	const { data } = useGetTruckloadDeliveryQuery()
	const currentPurchaseOrderValue = useWatch({ control, name })
	const [searchTerm, setSearchTerm] = useState(currentPurchaseOrderValue || '')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchPurchaseOrderQuery(debouncedSearchTerm)
	const currentId = getValues('id')

	useEffect(() => {
		if (!currentPurchaseOrderValue) return

		const matchPurchaseOrder = purchaseOrders?.find?.((item) => item.po === currentPurchaseOrderValue)
		if (!matchPurchaseOrder) return

		// * For update action, need to exclude current record's outbound qty

		const alreadyAddedOutboundQty = data
			.filter((item) => {
				if (props['data-action'] === CommonActions.UPDATE)
					return item.po === currentPurchaseOrderValue && item.id !== currentId
				return item.po === currentPurchaseOrderValue
			})
			.reduce((acc, curr) => acc + curr.outbound_qty, 0)

		const { po_qty: purchaseOrderQty, accumulated_outbound_qty: accumulatedOutboundQty } = matchPurchaseOrder

		const maxQtyFieldName: FirstParameter<typeof setValue> =
			typeof props['data-index'] === 'number'
				? `outbound_purchase_orders.${props['data-index']}.max_outbound_qty`
				: 'max_outbound_qty'

		setValue(maxQtyFieldName, purchaseOrderQty - accumulatedOutboundQty - alreadyAddedOutboundQty)
	}, [data, purchaseOrders, currentPurchaseOrderValue, currentId])

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
			{...props}
		/>
	)
}

export default PurchaseOrderFieldControl
