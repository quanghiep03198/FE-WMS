'use no memo'

import { useSearchPurchaseOrderQuery } from '@/app/(features)/-hooks/use-order-asm'
import { CommonActions } from '@/common/constants/enums'
import { AutoCompleteFieldControl } from '@/components/ui'
import { AutoCompleteFieldControlProps } from '@/components/ui/@field-control/auto-complete'
import { IPurchaseOrderResult } from '@/services/order.service'
import { useDebounce } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery } from '../-hooks/use-truckload-delivery-asm'
import { CreateDeliveryFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

type PurchaseOrderFieldControlProps = Partial<
	Omit<
		AutoCompleteFieldControlProps<{
			po: string
			po_qty: number
			accumulated_outbound_qty: number
			is_completed: boolean
		}>,
		'onSelect'
	>
> & {
	onSelect?: (selectedItem: IPurchaseOrderResult) => any
	['data-action']: CommonActions.CREATE | CommonActions.UPDATE
	['data-index']?: number
}

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = ({ name, onSelect, ...props }) => {
	const fieldIndex: number | undefined = props['data-index']
	const fieldAction: CommonActions.CREATE | CommonActions.UPDATE = props['data-action']

	const { t } = useTranslation()
	const { control, getValues, setValue } = useFormContext<CreateDeliveryFormValues | UpsertPurchaseOrdersFormValues>()
	const { data } = useGetTruckloadDeliveryQuery()
	const currentPurchaseOrderValue = useWatch({ control, name })
	const [searchTerm, setSearchTerm] = useState(typeof fieldIndex === 'number' ? (currentPurchaseOrderValue ?? '') : '')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchPurchaseOrderQuery(debouncedSearchTerm)
	const currentId = getValues(`outbound_purchase_orders.${fieldIndex}.id`)

	useEffect(() => {
		if (!currentPurchaseOrderValue) return

		const matchPurchaseOrder = purchaseOrders?.find?.((item) => item.po === currentPurchaseOrderValue)
		if (!matchPurchaseOrder) return

		// * For update action, need to exclude current record's outbound qty

		const alreadyAddedOutboundQty = data
			.flatMap((delivery) => delivery.delivery_details)
			.filter((item) => {
				if (fieldAction === CommonActions.UPDATE)
					return item.po === currentPurchaseOrderValue && item.id !== currentId
				return item.po === currentPurchaseOrderValue
			})
			.reduce((acc, curr) => acc + curr.outbound_qty, 0)

		const { po_qty: purchaseOrderQty, accumulated_outbound_qty: accumulatedOutboundQty } = matchPurchaseOrder

		const maxOutboundQty = purchaseOrderQty - accumulatedOutboundQty - alreadyAddedOutboundQty
		setValue(`outbound_purchase_orders.${fieldIndex}.max_outbound_qty`, Math.max(0, maxOutboundQty))
	}, [data, purchaseOrders, currentPurchaseOrderValue, currentId])

	return (
		<AutoCompleteFieldControl
			name={name}
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			labelField='po'
			valueField='po'
			loading={isLoading}
			datalist={purchaseOrders}
			onInput={setSearchTerm}
			onSelect={(value) => {
				if (typeof onSelect === 'function') onSelect(purchaseOrders?.find((item) => item?.po === value))
			}}
			{...props}
		/>
	)
}

export default PurchaseOrderFieldControl
